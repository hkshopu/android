// const host = "http://52.221.238.247:8000/api";
const host = "http://api.hkshopu.com:8000/api";
const apis = {
	header: "",
	 headerLogin: "hkshopu",
	keys: {
	    token: "@accessToken:Key",
	    user: "@accessUser:Key",
	},
	types: {
		blog: 1,
		news: 2,
		shop: 3,
		product: 4,
	},
	urls: {
		shop: {
			main: host + "/shop",
			following: host + "/shopfollowing",
			rating: host + "/shoprating",
			comment: host + "/shopcomment",
		}, blog: {
			main: host + "/blog",
			comment: host + "/blogcomment",
		}, product: {
			main: host + "/product",
			follow: host + "/productfollowing",
		}, cart: {
			main: host + "/cart",
			test: host + "/carttest",
		}, user: {
			main: host + "/user",
			signup: host + "/signup",
			login: host + "/login",
			logout: host + "/logout",
		}, order: {
			main: host + "/order",
		}, category: {
			product: host + "/productcategory",
		},
	}
}

export {
	apis
};