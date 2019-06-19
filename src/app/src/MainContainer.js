import { drizzleConnect } from "drizzle-react";
import MainComponent from "./MainComponent";
import {sayHelloAction} from "./actions/customAction";

const mapStateToProps = (state) => {
    return {
        hello: state.customReducer.sayHello,
        accounts: state.accounts,
        accountBalances: state.accountBalances,
        DeedToken: state.contracts.DeedToken,
        drizzleStatus: state.drizzleStatus
    };
};


const mapDispatchToProps = (dispatch) => (
    {
        onClickSayHello: (params) => {dispatch(sayHelloAction(params))}
    }
);

const MainContainer = drizzleConnect(MainComponent, mapStateToProps, mapDispatchToProps);

export default MainContainer;