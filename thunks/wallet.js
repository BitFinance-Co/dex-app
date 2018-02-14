import * as _ from "lodash";
import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import { setWallet, setTokens, setQuoteToken, setBaseToken, finishedLoadingTokens, finishedLoadingWallet } from "../actions";
import { getZeroExClient } from "../utils/ethereum";

// Would like to password protect using Ethereum Secret Storage
// `wallet.toV3("nopass")` is very expensive.
export function generateWallet() {
  return async (dispatch) => {
    let wallet = await Wallet.generate();
    await AsyncStorage.setItem("wallet", wallet.getPrivateKey().toString("hex"));
    dispatch(setWallet(wallet));
  };
}

export function loadWallet() {
  return async (dispatch) => {
    let privateKey = await AsyncStorage.getItem("wallet");
    if (privateKey) {
      let wallet = Wallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
      dispatch(setWallet(wallet));
      dispatch(finishedLoadingWallet());
      return wallet;
    } else {
      return null;
    }
  };
}