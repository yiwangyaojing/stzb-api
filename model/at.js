const express = require('express');
const User = require('../mongod/user');
const upAt = require('../model/upAt')
const at = {
	UpAt:function(content){
		let ignoreRegexs = [
            /```.+?```/g, // 去除单行的 ```
            /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
            /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
            /^    .*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
            /\b\S*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
            /\[@.+?\]\(\/.+?\)/g, // 已经被 link 的 username
        ]
		//凡是匹配以上验证规则的内容,被替换成""空字符;
		ignoreRegexs.forEach((item) => {
			//replace(验证规则,新内容);
			content = content.replace(item,'');
		})
		let z = /@[a-zA-Z0-9_]+\b/igm;
		//会以数组的形式把@**分开
		let con = content.match(z)
		let users = [];
		if( con ){
			con.forEach( ( cons) => {
				users.push(cons.slice(1));
				
			})
		}
		
		let arr = []
		for( var i = 0 ; i < users.length ; i++ ){
			if(arr.indexOf(users[i]) < 0){
				arr.push(users[i])
			}
		}
		
		return arr
	},
	//普通的文章发布@
	//大文章的文章id!!!!!,一级(多级回复)的id,当前登录人的id,要@的人
	UseAt:function(article_id,reply_user_id,user_id,content){
						console.log('进来了')
		let names = at.UpAt(content)
						console.log(names)
		if( names.length > 0 ){
			
			names.forEach(function(name){
				
				User.getUserName(name,(err,data) => {
					if( data ){
						
//						console.log(data)
						
						if( reply_user_id ){
							
						}else{
							//不是回复中@,也就是普通的文章发布
							console.log('文章中@')
							var str1 = JSON.stringify(user_id);  
							var str2 = JSON.stringify(data._id);  
							if( str1 == str2 ){
								
								console.log('不能@自己') 
								
							}else{
								upAt.At(user_id,article_id,data._id)
								console.log('可以执行@了')
							}
							
						}
						
					}
				})
				
			})
			
		}
		
	},
	
	//一级回复的@和通知
	//大文章的文章id!!!!!,一级回复的id,当前登录人的id,要@的人,大文章的作者id
	UserReplyAt:function(article_id,reply_id,user_id,content,author_id){
		console.log('进来了')
		let names = at.UpAt(content)
		console.log(names)
		if( names.length > 0 ){
			
			names.forEach(function(name){
				
				User.getUserName(name,(err,data) => {
					if( data ){
						//当前的登陆者
						var str1 = JSON.stringify(user_id);  
						//data._id是要@的人
						var str2 = JSON.stringify(data._id);  
						//author_id大文章作者id
						var str3 = JSON.stringify(author_id);
						//如果当前的登陆者等于@的人
//						if( str1 == str2 ){
//							
//							console.log('想通的不能@')
//							
//						}else{
//							console.log('可以@')
//						}
						//如果当前的登录人是作者的话,@的人却不是作者,也就是作者@了其他人
						if( str1 == str3 && str1 !== str2){
							//这里可以执行@其他人
							//谁,某个文章,被@得人,一级回复的id,
							upAt.ReplyAt(user_id,article_id,data._id,reply_id,null,content)
						}
						//如果登录人不是作者,也不是@自己
						if( str1 !== str3 && str1 !== str2 ){
							//这里可以执行@所有人
							upAt.ReplyAt(user_id,article_id,data._id,reply_id,null,content)
						}else{
						}
						//如果登录人不是作者,却@了自己
						if( str1 !== str3 && str1 == str2 ){
							//这里不能进行任何@
						}
						//如果登录人是作者又@了自己
						if( str1 == str3 && str1 == str2 ){
							//这里不能进行任何@
						}
						
						
					}
				})
				
			})
			
		}
		
	},
	
	//二级多级回复的@和通知
	//1大文章的文章id,2一级回复的作者id,3二级回复的作者id,4当前的登录人id,5要@的人,6大文章的作者id,7一级回复的id
	UserCommentAt:function(article_id,reply_user_id,comment_user_id,user_id,content,article_user_id,reply_id){
		console.log('进来了')
		let names = at.UpAt(content)
		console.log(names)
		if( names.length > 0 ){
			
			names.forEach(function(name){
				
				User.getUserName(name,(err,data) => {
					if( data ){
						//当前的登陆者
						var str1 = JSON.stringify(user_id);  
						//data._id是要@的人
						var str2 = JSON.stringify(data._id);  
						//author_id大文章作者id
						var str3 = JSON.stringify(article_user_id);
						//一级回复的id
						var str4 = JSON.stringify(reply_user_id);
						//二级回复的id
						var str5 = JSON.stringify(comment_user_id);
						
						if( comment_user_id ){
							
							console.log('是多级回复!!!')
							if( str1 !== str2){
								//谁@你,文章id,被@的人,一级回复的那个id,二级回复的id,该回复的内容
								upAt.ReplyAt(user_id,article_id,data._id,reply_id,comment_user_id,content)
							}
							
							
						}else{
						
						if( str1 == str3 ){
							console.log('登陆者和大作者是一个人')
							//如果一级回复的作者是当前的登录人,那么可以通知被@的人
							if( str1 == str4  && str1 !== str2){
								//可以执行@
								//谁@你,文章id,被@的人,一级回复的那个id,二级回复的id,该回复的内容
								upAt.ReplyAt(user_id,article_id,data._id,reply_id,null,content)
								
							}
							//如果当前的登录人是大文章的作者却不是一级回复的作者,那么它@的人,可以通知
							if( str1 !== str4 && str1 !== str2 ){
								//可以执行@
								//谁@你,文章id,被@的人,一级回复的那个id,二级回复的id,该回复的内容
								upAt.ReplyAt(user_id,article_id,data._id,reply_id,null,content)
							}
							
						}else{
							console.log('登陆者和大作者不是一个人')
							
							if( str1 !== str2 && str4 !== str3){
								//可以执行@
								//谁@你,文章id,被@的人,一级回复的那个id,二级回复的id,该回复的内容
								upAt.ReplyAt(user_id,article_id,data._id,reply_id,null,content)
								
							}
							
						}
						
						//如果大文章的作者就是一级回复的作者
						if( str4 == str3 ){
							
							if( str1 !== str4 && str1 !== str2 ){
								//可以执行@
								//谁@你,文章id,被@的人,一级回复的那个id,二级回复的id,该回复的内容
								upAt.ReplyAt(user_id,article_id,data._id,reply_id,null,content)
								
							}
							
						}
						
						
						
						
						}
					}
				})
				
			})
			
		}
	}
}

module.exports = at