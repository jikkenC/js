var consumerKey    = "vlaPqZoldKyrhygo8CVHifezD";
var consumerSecret = "HIulAOYBTdybIY2pyQga0i0zjbUQ3lXmf7bzYelnbHhDWgmOO9";
var accessToken    = "1446387127-GMz7jbLT57JTxkxJIRk2j3JB08KP9NETcLLOBVZ";
var tokenSecret    = "S0sdm4x5qoNohtnppfFpXGICYH3IFssX5HaR0Rbl5oLS5";

var count = 25; // 表示する件数

var center_ido = 35.70602892754558;
var center_keido =  139.70755577087402;
var radius = "70km";

// Twitter APIを使用してTweetを取得する部分
// function getTwitter(action, options) {
function getTwitter(action, keywords) {

	var accessor = {
		consumerSecret: consumerSecret,
		tokenSecret: tokenSecret
	};

	// 送信するパラメータを連想配列で作成
	var message = {
		method: "GET", // リクエストの種類
		action: action,
		parameters: {
			oauth_version: "1.0",
			oauth_signature_method: "HMAC-SHA1",
			oauth_consumer_key: consumerKey, // コンシューマーキー
			oauth_token: accessToken, // アクセストークン
			count: count, // 取得する件数
			"q": keywords, // 検索するキーワード
			"lang": "ja", // 日本語に設定
			"geocode": center_ido+","+center_keido+","+radius,
			"result_type": "recent", // 最新の情報を取得するように設定
			callback: "update" // 取得したデータをupdate関数に渡すよう設定
		}
	};

	// OAuth認証関係
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var url = OAuth.addToURL(message.action, message.parameters);

	// ajaxによる通信
	$.ajax({
		type: message.method,
		url: url, // リクエスト先のURL
		dataType: "jsonp",
		jsonp: false,
		cache: true,
	});
}

// UIの更新
function update(data){ // 引数(data)に取得したデータが入ってくる
	$(".Tweet_area").empty(); // 表示エリアを空にする
	var result = data.statuses; // 取得したデータから、メソッドチェーンで必要なものを取得
	removeMarkers();
	var count = 0;
	for( var i = 0; i < result.length; i++ ) {
		var name = result[i].user.name; // ツイートした人の名前
		var imgsrc = result[i].user.profile_image_url; // ツイートした人のプロフィール画像
		var content = result[i].text; // ツイートの内容
		var updated = result[i].created_at.split('+'); // ツイートした時間
		// var place = result[i].place;
		var geo = result[i].geo;
		// console.log(place);
		if (geo != null) {
			console.log(count++);
			ido = geo.coordinates[0];
			keido = geo.coordinates[1];
			var marker = markOnMap(ido, keido, name, content, imgsrc);
			var time = "";
			// Tweet表示エリアに取得したデータを追加していく
			$(".Tweet_area").append('<div class="tweet_each" id="tweet_' + count + 
					'"> <hr/>'+updated[0] + 
					'<h4><img id="name" src="'+imgsrc+'"/>  ' + name + 
					'</h4>' + ' <p> ' + content + ' </p><br/></div> ');
			var tweet_num = "tweet_" + count;
			// console.log(tweet_num);
			$("div#"+tweet_num).click(function(){
				console.log(this.id);
				var id = this.id;
				var num = id.split('_');
				console.log(num[1]);
				google.maps.event.trigger(marker_list.getAt(num[1]-1),"click");
			});
			// console.log(marker);

		}
	}
}

// ウィンドウを読み込み後に実行される
$(window).load(function(){
// window.onload(function(){

	// idに検索ボタンと指定されている button要素にクリックイベントを設定
	$("#search_button").on("click", function(){
		// idにキーワード入力欄と指定されている input要素に入力されている値を取得
		var keywords = $("#keyword_area").val();
		// keywordsに何も入力されていなかった場合の処理
		console.log(keywords);
		if(keywords == ""){
			alert("入力してください。"); // メッセージを表示
			return; // 処理を中断
		}
		else{
			// alert(keywords + "　が入力されています。");
		}

		// リクエスト先のURL
		var url = "https://api.twitter.com/1.1/search/tweets.json";

		// Tweet検索関数の呼び出し
		getTwitter(url, keywords);

	});

	$("#set_center").on("click", function(){
		center_ido = marker_list.getAt(0).getPosition().lat();
		center_keido = marker_list.getAt(0).getPosition().lng();
		console.log(marker_list.getAt(0).getPosition().lat());
		console.log(marker_list.getAt(0).getPosition().lng());
		// console.log(marker_list.getAt(0).getPosition());
	});

});

