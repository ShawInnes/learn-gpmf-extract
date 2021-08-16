const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require('gopro-telemetry');

class ProcessService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  process(file: Blob, onProgress: any): Promise<any> {
    return new Promise<any>((resolve) => {
      gpmfExtract(file, true, onProgress)
        .then((result) => {
          goproTelemetry(result).then((data) => {
            console.log('data', data);
            resolve({
              result,
              data,
            });
          });
        })
        .catch((error) => console.log(error));
    });
  }
}

export default new ProcessService();
