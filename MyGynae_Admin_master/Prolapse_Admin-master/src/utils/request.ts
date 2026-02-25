import { message } from 'antd';
import { history } from 'umi';
export const root = 'https://cs1.ucc.ie/yanlin/prolapse';
// export const root = 'http://127.0.0.1:8080';

// Encapsulation fetch
const formatParam = (param: any) => {
  if (typeof param === 'string') {
    return encodeURIComponent(param);
  } else {
    return param;
  }
};

const joinParam = (url: string, payload: any) => {
  let paramsArray: any = [];
  if (typeof payload === 'string') {
    return `${url}?${payload}`;
  }
  Object.keys(payload).forEach((key) => {
    if (payload[key] === 0) {
      payload[key] = '0';
    }
    if (payload[key]) {
      paramsArray.push(key + '=' + formatParam(payload[key]));
    }
  });
  if (url.search(/\?/) === -1) {
    if (paramsArray.length) {
      url += '?' + paramsArray.join('&');
    }
  } else {
    url += '&' + paramsArray.join('&');
  }
  return url;
};

const downloadrequest = (url: string, config: RequestInit) => {
  return fetch(`${root}${url}`, config)
    .then((res: Response) => {
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.clear();
          throw Error(
            `You haven't log on yet or your session has time out, please log on again.`,
          );
        }
        const errortext = res.statusText;
        throw Error(errortext);
      }
      return res.blob();
    })
    .then((blob) => {
      var filename = `patients.csv`;
      var a = document.createElement('a');
      document.body.appendChild(a); //兼容火狐，将a标签添加到body当中
      var url = window.URL.createObjectURL(blob); // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
      a.href = url;
      a.download = filename;
      a.target = '_blank'; // a标签增加target属性
      a.click();
      a.remove(); //移除a标签
      window.URL.revokeObjectURL(url);
    })
    .catch((error: Error) => {
      const msg = error.message || 'Network error.';
      message.error(msg);
      return { error: msg };
    });
};

const request = (url: string, config: RequestInit) => {
  return fetch(`${root}${url}`, config)
    .then((res: Response) => {
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('prol-a-token');
          history.push('/login');
          throw Error(
            `You haven't log on yet or your session has time out, please log on again.`,
          );
        }
      }
      return res.json();
    })
    .then((resJson: any) => {
      if (!!resJson.error) {
        throw Error(resJson.error);
      }
      return resJson;
    })
    .catch((error: Error) => {
      const msg = error.message || 'Network error.';
      message.error(msg);
      return { error: msg };
    });
};

// ------------------ GET -------------------
const get = (url: string, data?: any) => {
  return request(data ? joinParam(url, data) : url, {
    method: 'GET',
    headers: {
      token: localStorage.getItem('prol-a-token') as any,
    },
  });
};

// ------------------ POST --------------------
const post = (url: string, data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((item) => {
    formData.append(item, data[item]);
  });
  const headers = { token: localStorage.getItem('prol-a-token') as any };

  return request(url, {
    method: 'POST',
    body: formData,
    headers: headers,
  });
};

// ------------------ DELETE -------------------
const delet = (url: string) => {
  return request(url, {
    method: 'DELETE',
    headers: {
      token: localStorage.getItem('prol-a-token') as any,
    },
  });
};

const put = (url: string, data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((item) => {
    formData.append(item, data[item]);
  });
  const headers = { token: localStorage.getItem('prol-a-token') as any };

  return request(url, {
    method: 'PUT',
    body: formData,
    headers: headers,
  });
};

// ------------------ DOWNLOAD --------------------
const download = (url: string, data?: any) => {
  return downloadrequest(data ? joinParam(url, data) : url, {
    method: 'GET',
    headers: {
      token: localStorage.getItem('prol-a-token') as any,
    },
  });
};

export { get, delet, post, put, download };
