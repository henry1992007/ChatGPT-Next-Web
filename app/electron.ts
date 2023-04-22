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
      return electron.getCredentials(account);
    }
  },
  saveCredentials: async (account: string, password: string) => {
    const electron = getElectron();
    if (electron) {
      return electron.saveCredentials(account, password);
    }
  },
  deleteCredentials: async (account: string) => {
    const electron = getElectron();
    if (electron) {
      return electron.deleteCredentials(account);
    }
  },
  readData: async (key: string) => {
    const electron = getElectron();
    if (electron) {
      return electron.readData(key);
    }
  },
  saveData: async (key: string, value: string) => {
    const electron = getElectron();
    if (electron) {
      return electron.saveData(key, value);
    }
  },
};
