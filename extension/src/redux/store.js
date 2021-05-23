
import { createStore } from 'redux';
import storeCreatorFactory from 'reduxed-chrome-storage';
import reducers from './reducers'
import { STORAGE_AREA } from '../config'

const storeCreator = storeCreatorFactory({ createStore, storageArea: STORAGE_AREA })

//const storeCreator = () => createStore(reducers) // storeCreatorFactory({ createStore, storageArea: STORAGE_AREA })
let store

const getStore = async () => {
  if (store)
    return store;
  store = await storeCreator(reducers);
  return store;
};

export {
  getStore
}