import Store from 'electron-store';
Store.initRenderer()
const eStore = new Store()

class db<T=any> {
    private name: string

    constructor(name: string) {
        this.name = name
    }

    public get(): T {
        return eStore.get(this.name) as T;
    }

    public set(data: T): db<T> {
        eStore.set(this.name, data)
        return this
    }
}

export function useDb<T=any>(name: string): db<T> {
    return new db<T>(name)
}