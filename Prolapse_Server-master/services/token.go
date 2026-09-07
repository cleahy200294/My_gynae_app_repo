package services

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type AccountClaims struct {
	ID       uint   `json:"account_id"`
	Email    string `json:"email"`
	Role     int    `json:"role"`
	DoctorId uint   `json:"doctor_id"`
	jwt.StandardClaims
}

var (
	effectTime = 12 * time.Hour
)

func jwtSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if len(secret) < 32 {
		panic("JWT_SECRET must contain at least 32 characters")
	}
	return []byte(secret)
}

func GenerateToken(account *AccountClaims) string {
	account.ExpiresAt = time.Now().Add(effectTime).Unix()
	sign, err := jwt.NewWithClaims(jwt.SigningMethodHS256, account).SignedString(jwtSecret())
	if err != nil {
		fmt.Println(err.Error())
		return ""
	}
	// sign is a token string
	return sign
}

func JwtVerify(c *gin.Context) {
	// get token from header
	token := c.GetHeader("token")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "token not exist!"})
		c.Abort()
		return
	}
	claims, err := parseToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
		c.Abort()
		return
	}
	c.Set("account", claims)
	c.Next()
}

func parseToken(tokenString string) (*AccountClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &AccountClaims{}, func(token *jwt.Token) (interface{}, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, fmt.Errorf("unexpected signing method: %s", token.Method.Alg())
		}
		return jwtSecret(), nil
	})
	if err != nil || !token.Valid {
		return nil, fmt.Errorf("parse token: %w", err)
	}
	claims, ok := token.Claims.(*AccountClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}
	return claims, nil
}

func RequireRoles(roles ...int) gin.HandlerFunc {
	allowed := make(map[int]bool, len(roles))
	for _, role := range roles { allowed[role] = true }
	return func(c *gin.Context) {
		account, ok := c.Get("account")
		claims, valid := account.(*AccountClaims)
		if !ok || !valid || !allowed[claims.Role] {
			c.JSON(http.StatusForbidden, gin.H{"error": "insufficient permissions"})
			c.Abort()
			return
		}
		c.Next()
	}
}
