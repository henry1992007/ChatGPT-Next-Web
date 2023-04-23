const getElectron = () => {
  if (typeof window !== "undefined") {
    return typeof window !== "undefined" ? (window as any).electronAPI : null;
  }
};

export default {
  electron: getElectron(),
  getCredentials: async (account: string) => {
    const electron = getElectron();
    if (electron) {
      return await electron.getCredentials(account);
    }
  },
  saveCredentials: async (account: string, password: string) => {
    const electron = getElectron();
    if (electron) {
      return await electron.saveCredentials(account, password);
    }
  },
  deleteCredentials: async (account: string) => {
    const electron = getElectron();
    if (electron) {
      return await electron.deleteCredentials(account);
    }
  },
  readData: async (key: string) => {
    const electron = getElectron();
    if (electron) {
      return await electron.readData(key);
    }
  },
  saveData: async (key: string, value: string) => {
    const electron = getElectron();
    if (electron) {
      await electron.saveData(key, value);
    }
  },
  deleteData: async (key: string) => {
    const electron = getElectron();
    if (electron) {
      await electron.deleteData(key);
    }
  },
};
