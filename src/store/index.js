import {createStore} from "vuex";
import {game} from "@/store/modules/game";
import {account} from "@/store/modules/account";
import {currentUser} from "@/store/modules/currentUser";

export default createStore({
  modules: {
    game,
    account,
    currentUser
  }
});