import axios, { AxiosResponse } from 'axios';

interface PCCCResponse {
  IssYn: string;
  obj: {
    persEcm: string;
    dcerNm: string;
    custPsno: string;
    custBscsAddr: string;
    custDtlAddr: string;
    telno: string;
    cralTelno: string;
    eml: string;
  }
}

(async () => {
  const name = ''; // edit here
  const birth = ''; // edit here
  const secret = ''; // edit here

  if (!name || !birth || !secret) {
    console.error('Please edit name, birth, secret');
  }

  if (birth.length !== 6 || secret.length !== 7) {
    console.error('Invalid birth or secret');
  }

  const verification = await axios.post('https://unipass.customs.go.kr/csp/userRlnmCrtfRect.do',
    `rrnoFrdg_fake=&rrnoBcdg_fake=&checkType=4&dcerNm=${encodeURI(name)}&rrnoFrdg=${birth}&rrnoBcdg=${secret}&rrnoNo=&MYC1104002Q_telnum1=&MYC1104002Q_telnum2=&MYC1104002Q_telnum3=&MYC1104002Q_certifiNum=&MYC1104002Q_dcerNm=&MYC1104002Q_rrno=&MYC1104002Q_name=&MYC1104002Q_ecm=&MYC1104002Q_telno=&MYC1104002Q_timeCnt=&MYC1104002Q_certifiNum2=&MYC1104002Q_qryIssTp=1`);

  const verificationCookie = verification?.headers['set-cookie'] ? verification?.headers['set-cookie'][0] : '';

  const checkIssued = await axios.post('https://unipass.customs.go.kr/csp/retrievepersEcmIssYnRect.do',
    `dcerNm=${encodeURI}&rrno=${birth}${secret}&rrnoFrdg=${birth}`,
    {
      headers: {
        'Cookie': verificationCookie,
      },
    },
  )

  const result: AxiosResponse<PCCCResponse> = checkIssued;

  if (result.data.IssYn === 'N') {
    console.log('=== PCCC not issued ===');
    return;
  }

  console.log('=== PCCC already issued ===');
  console.log({
    pcccId: result.data.obj.persEcm,
    name: result.data.obj.dcerNm,
  })
})();
