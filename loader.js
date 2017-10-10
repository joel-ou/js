/**
 * @author wei.ou
 * @date 2017年07月09日
 * @copyright wei.ou
 * 请勿删除作者信息
 * @使用前必读：代码需要jQuery，如不支持请自行修改。代码重写了jQuery的load方法，如果需要jQuery的方法请更换方法名。
 */
$(function(){
	$.support.fragments = typeof history.pushState !== "undefined";
	var fn = {};
	
	fn.isEmpty = function(target){
		if(target === null || typeof(target) === 'undefined'){
			return true;
		}
		if(typeof(target) === 'string'){
			if($.trim(target) === ""){
				return true;
			}
		}
		return false;
	}
	/**
	 * 加载页面
	 */
	fn.load = function(url, params, success, uriNotChange){
		var cthis = $(this);
		if(config.showLoaderCover){
			loadingCover();
		}
		$.ajax({url:url, headers:{isFragment: true}, data: params, dataType: "html"}).done(function(html){
			if($.support.fragments && !Boolean(uriNotChange)){
				if(location.pathname !== url){
					history.pushState(null, null, url);
				}
			}
			pathCache['old'] = {path: location.pathname, isLoader: true};
			if($.isFunction(success)){
				success.call(cthis, html);
				return;
			}
			cthis.empty().append(html);
		}).always(function(){
			if(config.showLoaderCover){
				loadingCover.hide();
			}
		});
	}
	
	var pathCache = {old:{}, getPath: function(key){
		var result = pathCache[key];
		return fn.isEmpty(result)||(typeof result) !== "object"?"":result['path'];
	}};
	
	/**
	 * 地址变化监听器，解决因为通过putState更改的地址不刷新问题
	 */
	var listener = function(success){
		if(!$.support.fragments || Boolean(this.isListening)){return false;}
		this.isListening = true;
		this.id = window.setInterval(function(){
			var curPath = location.pathname,
				oldPath = pathCache.getPath('old'),
				oldCachePath = pathCache['old'];
			if(fn.isEmpty(oldPath) || curPath === oldPath || !Boolean((oldCachePath||{})['isLoader'])){
				return;
			}
			fn.load.call($(this), location.href, {}, success, true);
		}, 500);
	}

	//绑定到jQuery
	$.fn.extend({
		load: function(url, params, success){
			fn.load.apply(this, arguments);
		}, 
		loaderListener: function(){
			listener.apply(this, arguments);
		} 
	});
	window.loader = fn;
});
