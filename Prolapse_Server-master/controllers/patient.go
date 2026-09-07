package controllers

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"prolapse-server/db"
	"prolapse-server/models"
	"prolapse-server/services"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func GetPatientAllList(c *gin.Context) {
	firstname := c.Query("firstname")
	surname := c.Query(("surname"))
	current, _ := strconv.Atoi(c.Query("current"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))

	var patients []models.User
	patientDb := db.DB.Model(&models.User{}).Order("wating desc, id desc")

	if surname != "" {
		patientDb = patientDb.Where("surname like ?", "%"+surname+"%")
	}
	if firstname != "" {
		patientDb = patientDb.Where("firstname like ?", "%"+firstname+"%")
	}
	if current != 0 && pageSize != 0 {
		var count int64
		patientDb.Count(&count)
		patientDb.Offset((current - 1) * pageSize).Limit(pageSize).Find(&patients)
		c.JSON(http.StatusOK, gin.H{"count": count, "data": patients})
	} else {
		patientDb.Find(&patients)
		c.JSON(http.StatusOK, patients)
	}
}

func GetPatientList(c *gin.Context) {
	account, _ := c.Get("account")
	accountt := account.(*services.AccountClaims)

	firstname := c.Query("firstname")
	surname := c.Query(("surname"))
	current, _ := strconv.Atoi(c.Query("current"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))

	var patients []models.User
	patientDb := db.DB.Model(&models.User{}).
		Joins("join accounts on accounts.id = users.account_id").
		Where("accounts.doctor_id = ?", accountt.ID).
		Order("wating desc, id desc")

	if surname != "" {
		patientDb = patientDb.Where("surname like ?", "%"+surname+"%")
	}
	if firstname != "" {
		patientDb = patientDb.Where("firstname like ?", "%"+firstname+"%")
	}
	if current != 0 && pageSize != 0 {
		var count int64
		patientDb.Count(&count)
		patientDb.Offset((current - 1) * pageSize).Limit(pageSize).Find(&patients)
		c.JSON(http.StatusOK, gin.H{"count": count, "data": patients})
	} else {
		patientDb.Find(&patients)
		c.JSON(http.StatusOK, patients)
	}
}

func GetUserInfoById(c *gin.Context) {
	var userId uint
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		userId = uint(id)
	}
	var user models.User
	if err := db.DB.Where("id = ?", userId).First(&user).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

func ResetUserWaiting(c *gin.Context) {
	var userId uint
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		userId = uint(id)
	}
	var user models.User
	if err := db.DB.Where("id = ?", userId).First(&user).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(user)
	user.Wating = 0
	fmt.Println(user)
	if err := db.DB.Save(user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, "Update Waiting Successfully")
}

func SaveUserInfoById(c *gin.Context) {
	var user models.User
	if err := c.Bind(&user); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	// if saved and server data is same, no changed
	var user1 models.User
	user1.ID = user.ID
	db.DB.First(&user1)
	user.Model = user1.Model
	if user == user1 {
		c.JSON(http.StatusOK, gin.H{"msg": "Saved successfully"})
		return
	}
	if err := db.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Saved successfully"})
}

func UpdateUrodynamics(c *gin.Context) {
	userId := c.Param("id")
	urodynamics := c.PostForm("urodynamics")
	var user models.User
	if err := db.DB.Where("id = ?", userId).First(&user).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user.Urodynamics = urodynamics
	db.DB.Save(&user)
	c.JSON(http.StatusOK, "Update urodynamics successfully")
}

func calculateAge(birthdate time.Time) float64 {
	// 获取当前时间
	today := time.Now()
	// 计算年龄
	age := today.Year() - birthdate.Year()

	// 检查生日是否已经过了今年的日期
	if today.Month() < birthdate.Month() || (today.Month() == birthdate.Month() && today.Day() < birthdate.Day()) {
		age--
	}

	return float64(age)
}

// containsSimpleFuzzyFunction 接受两个字符串参数 a 和 b，
// 如果 a 大概包含 b（简单的模糊匹配），则返回 1.0，否则返回 0.0
func containsSimpleFuzzyFunction(a string, b string) float64 {
	// 将两个字符串都转换为小写，忽略大小写差异
	a = strings.ToLower(a)
	b = strings.ToLower(b)

	// 设置一个匹配计数器
	matchCount := 0

	// 遍历 b 的每个字符，检查它是否出现在 a 中
	for _, char := range b {
		if strings.ContainsRune(a, char) {
			matchCount++
		}
	}

	// 如果匹配的字符数超过3/4，则认为是大概包含
	if matchCount >= len(b)/4*3 {
		return 1.0
	}

	return 0.0
}

func calculateBMI(weight float64, height float64) float64 {
	return weight / (height * height)
}

func PredictPOP(c *gin.Context) {
	var user models.User
	if err := c.Bind(&user); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	// 假设我们要传递给Python脚本的参数
	inputData := [][]float64{{
		containsSimpleFuzzyFunction(user.MainComplaint, "Parity"),
		calculateAge(user.Birthday),
		2,
		calculateBMI(user.Weight, user.Height),
		containsSimpleFuzzyFunction(user.PastSurgery, "POP repair"),
		containsSimpleFuzzyFunction(user.PastSurgery, "abdominal hysterectomy"),
		0,
		0,
		1,
		0,
		containsSimpleFuzzyFunction(user.CurrentMedication, "Anti-Diabetic"),
		containsSimpleFuzzyFunction(user.PastSurgery, "mesh removal"),
		containsSimpleFuzzyFunction(user.PastSurgery, "Instrumental delivery"),
		1,
		containsSimpleFuzzyFunction(user.CurrentMedication, "bladder"),
		containsSimpleFuzzyFunction(user.MainComplaint, "OAB"),
		containsSimpleFuzzyFunction(user.PastSurgery, "pessary"),
		containsSimpleFuzzyFunction(user.PastSurgery, "UUI"),
		containsSimpleFuzzyFunction(user.PastSurgery, "pessary vaginal"),
		containsSimpleFuzzyFunction(user.PastSurgery, "SUI"),
		containsSimpleFuzzyFunction(user.CurrentMedication, "Vaginal estrogen"),
		containsSimpleFuzzyFunction(user.MainComplaint, "HTN"),
		containsSimpleFuzzyFunction(user.MainComplaint, "Cholesterol"),
		containsSimpleFuzzyFunction(user.MainComplaint, "Constipation"),
		containsSimpleFuzzyFunction(user.MainComplaint, "Hypertensives"),
		0,
		containsSimpleFuzzyFunction(user.PastSurgery, "Abdominal/Lap"),
		containsSimpleFuzzyFunction(user.MainComplaint, "SSRI/SNRI"),
		containsSimpleFuzzyFunction(user.PastSurgery, "ABX"),
		containsSimpleFuzzyFunction(user.MainComplaint, "vag hys"),
		containsSimpleFuzzyFunction(user.MainComplaint, "Antiplatelet"),
		containsSimpleFuzzyFunction(user.MainComplaint, "Antiplatelet"),
		0,
		containsSimpleFuzzyFunction(user.MainComplaint, "CAD"),
	}}

	// 将数据转换为JSON字符串
	inputJSON, err := json.Marshal(inputData)
	if err != nil {
		fmt.Println("Error marshaling input data:", err)
		return
	}

	// 准备执行Python脚本的命令
	cmd := exec.Command("python3", "py-scripts/predict.py", string(inputJSON))

	// 捕获Python脚本的标准输出
	var out bytes.Buffer
	cmd.Stdout = &out

	// 执行命令
	err = cmd.Run()
	if err != nil {
		fmt.Println("Error running Python script:", err)
		return
	}

	// 读取并解析Python脚本的输出
	var result [][]float64
	err = json.Unmarshal(out.Bytes(), &result)
	if err != nil {
		fmt.Println("Error unmarshaling output data:", err)
		return
	}

	// 输出结果
	fmt.Println("Prediction results:", result)
	c.JSON(http.StatusOK, result)
}

func UploadPatientDoc(c *gin.Context) {
	var userId = c.Param("id")
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Upload pdf file error"})
		return
	}
	var user models.User
	if err := db.DB.Where("id = ?", userId).First(&user).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	filename := filepath.Base(file.Filename)
	path := "documents/" + userId + "_" + user.Firstname + "-" + user.Surname + "_" + filename
	path = NewPath(path)
	c.SaveUploadedFile(file, path)

	if user.Documents == "" {
		user.Documents = path
	} else {
		user.Documents = user.Documents + " , " + path
	}
	if err := db.DB.Save(user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, "Upload documents successfully")
}

func RemovePatientDoc(c *gin.Context) {
	var userId = c.Param("id")
	var docName = "documents/" + c.Param("name")
	os.Remove(docName)
	var user models.User
	if err := db.DB.Where("id = ?", userId).First(&user).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	docs := strings.Split(user.Documents, " , ")
	index := Index(docName, docs)
	if index < 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}
	user.Documents = strings.Join(append(docs[:index], docs[index+1:]...), " , ")
	if err := db.DB.Save(user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, "Delete documents successfully")
}

func ExportPatientList(c *gin.Context) {
	rawIDs := strings.Split(c.Query("ids"), ",")
	ids := make([]uint, 0, len(rawIDs))
	for _, rawID := range rawIDs {
		id, err := strconv.ParseUint(strings.TrimSpace(rawID), 10, 64)
		if err != nil || id == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patient IDs"})
			return
		}
		ids = append(ids, uint(id))
	}
	var patients []models.User
	patientDb := db.DB.Model(&models.User{}).Order("id desc").Where("id IN (?)", ids)
	patientDb.Find(&patients)
	buf := new(bytes.Buffer)
	w := csv.NewWriter(buf)
	var data [][]string
	data = append(data, []string{
		"ID", "EMAIL", "FIRST NAME", "SURNAME", "DATE OF BIRTH", "PHONE", "HEIGHT", "WEIGHT",
		"MAIN COMPLAINT", "MEDICAL HISTORY", "MEDICAL HISTORY OTHER", "PAST SURGERY",
		"PAST GYNECOLOGY SURGERY", "PAST GYNECOLOGY SURGERY OTHER",
	})
	for _, patient := range patients {
		var p []string
		p = append(p,
			strconv.Itoa(int(patient.ID)),
			patient.Email,
			patient.Firstname,
			patient.Surname,
			patient.Birthday.Format("02/01/2006"),
			patient.Phone,
			fmt.Sprintf("%f", patient.Height),
			fmt.Sprintf("%f", patient.Weight),
			addDefault(patient.MainComplaint),
			addDefault(patient.MedicalHistory),
			addDefault(patient.MedicalHistoryOther),
			addDefault(patient.PastSurgery),
			addDefault(patient.PastGynecologySurgery),
			addDefault(patient.PastGynecologySurgeryOther),
		)
		data = append(data, p)
	}
	w.WriteAll(data)
	w.Flush()
	c.Writer.Header().Add("Content-type", "application/octet-stream")
	c.Header("Content-Disposition", "attachment; filename=patients.csv")
	io.Copy(c.Writer, buf)
}

func addDefault(in string) string {
	if len(in) > 0 {
		return in
	}
	return "None"
}

func Index[T any](v T, array []T) int {
	if n := len(array); array != nil && n != 0 {
		i := 0
		for !reflect.DeepEqual(v, array[i]) {
			i++
		}

		if i != n {
			return i
		}
	}
	return -1
}

func Exists(path string) bool {
	_, err := os.Stat(path) //os.Stat获取文件信息
	if err != nil {
		return os.IsExist(err)
	}
	return true
}

func NewPath(path string) string {
	if !Exists(path) {
		return path
	}
	flag := 1
	for {
		newPath := strings.Split(path, ".")[0] + "(" + strconv.Itoa(flag) + ")." + strings.Split(path, ".")[1]
		if !Exists(newPath) {
			return newPath
		} else {
			flag++
		}
	}
}
