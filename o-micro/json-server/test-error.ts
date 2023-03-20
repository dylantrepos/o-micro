export const sendFakeRequest = async (shouldFail?: boolean, status?: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // resolve(errorNumber);
            if (!shouldFail) console.log('Promise successful !');
            shouldFail ? reject({message: 'NOPE !', code: status || 500}) : resolve('success');
        }, 1000);
    })
}
