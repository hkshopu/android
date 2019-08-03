import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class PaypalView extends Component {
    constructor() {
        super();

        this.webView = null;
    }

    componentDidMount() {
        this.webView.postMessage(JSON.stringify(this.props.navigation.state.params));
    }

    onMessage(event) {
        console.log("On Message", event.nativeEvent.data);
    }

    handleResponse = data => {
        if (data.title === "success") {
            var splitted_url = data.url.split('#');
            this.props.navigation.navigate("OrderConfirmation", { orderID: splitted_url[1], isSuccessful: false });

        } else  if (data.title === "fail") {
            var splitted_url = data.url.split('#');
            this.props.navigation.navigate("OrderConfirmation", { orderID: splitted_url[1]  , isSuccessful: false });

        } else if (data.title === "cancel") {
            console.log("Show Are you sure you want to cancel transaction popup");
            
        } else {
            return;
        }
    };

    render() {
        const {params} = this.props.navigation.state;
        const sourceURL = "http://dev.hkshopu.com/webadmin/admin/order/pay?shopID=" + params.shopID + "&token=" + params.token + "&receiver=" + params.receiver + "&address=" + params.address;

        return (
            <WebView
                source={{ uri: sourceURL  }} // try here append shopid and token
                // source={{ uri: "http://192.168.1.8/paypal/index.html" }}
                ref={(webView) => this.webView = webView}
                onNavigationStateChange={data =>
                    this.handleResponse(data)
                }
            />
        );
    }
}
