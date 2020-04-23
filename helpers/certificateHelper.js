import pem from 'pem';
import fs from 'fs';
import path from 'path';
import os from 'os';

function ensureOpenSsl() {
  if (os.platform() === 'win32') {
    pem.config({ pathOpenSSL: 'C:/Program Files/OpenSSL-Win64/bin/openssl.exe' });
  }
}

export function createSelfSignedCertificate(certPath, keyPath, password) {
  ensureOpenSsl();
  pem.createCertificate({ selfSigned: true, serviceKeyPassword: password, days: 365 }, (err, result) => {
    fs.writeFileSync(path.join(__dirname, certPath), result.certificate);
    fs.writeFileSync(path.join(__dirname, keyPath), result.serviceKey);
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  });
}

export function getSerializedCertificate(certPath) {
  const pfx = fs.readFileSync(path.join(__dirname, certPath));
  const pfxAsString = pfx.toString().replace(/(\r\n|\n|\r|-|BEGIN|END|CERTIFICATE|\s)/gm, '');
  return pfxAsString;
}
