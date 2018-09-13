
class Brightback {
  constructor() {
    this.cancelUrl = false;
    this.el = document.getElementById('bb-cancel');

    if (this.el) {
      this.el.addEventListener('click', this.cancel.bind(this));
    }
  }

  cancel() {
    if (this.cancelUrl) {
      window.location.href = this.cancelUrl;
    } else if (this.el.getAttribute('href')) {
      window.location.href = this.el.getAttribute('href');
    }
  }

  addContext(data) {
    data.context = {
      locale: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      user_agent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };
    data.timestamp = new Date().toISOString();
    return data;
  }

  handleData(data) {
    const self = this;
    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:8080/precancel';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    xhr.onreadystatechange = function getResponse() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const message = JSON.parse(xhr.responseText);
        self.cancelUrl = message.valid ? message.url : false;
      }
    };
    xhr.send(JSON.stringify(this.addContext(data)));
  }

  handleDataPromise(data) {

    const parseReturn = (text, res, rej) => {
      try {
        const parsed = JSON.parse(text);
        res(parsed);
      } catch(e) {
        rej(e);
      }
    }

    return new Promise((resolve, reject) => {
      const self = this;
      const xhr = new XMLHttpRequest();
      const url = 'http://localhost:8080/precancel';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;
      xhr.onload = () => parseReturn(xhr.responseText, resolve, reject);
      xhr.onerror = () => reject(xhr.statusText, resolve, reject);
      xhr.send(JSON.stringify(this.addContext(data)));
    });
  }
}

window.Brightback = new Brightback();
