// slide_ie
// dev : Ȳ�ؼ�
;(function( $ ){
	$.fn.XSlide = function (options) {
		var settings = $.extend({}, $.fn.XSlide.defaults, options);

		//setting �� ����
		if (! vaildSetting(settings)) return;

		var slide_height = settings.centerBoxSize[1];
		if (settings.titleShow) {
			slide_height += 30;
		}

		$(this).css({
			width : settings.slideWidth,
			height : slide_height,
			position : "relative"
		});

		return this.each(function(){
			var centerIdx = parseInt(settings.centerIdx);
			var showImgCnt = parseInt(settings.showImgCnt);

			var basicWidth = parseInt(settings.basicBoxSize[0]);
			var basicHeight = parseInt(settings.basicBoxSize[1]);
			var basicMargin = parseInt(settings.marginBasicImg);
			var centerWidth = parseInt(settings.centerBoxSize[0]);
			var centerHeight = parseInt(settings.centerBoxSize[1]);
			var centerMargin = parseInt(settings.marginCenterImg);

			var slideObj = this;

			var basicMarginCnt = (((showImgCnt - 1) / 2) - 1) * 2;

			//�⺻�̹����� ������
			var slideWidth = basicWidth * (showImgCnt - 1);
			//�⺻���� ������ŭ
			slideWidth += settings.marginBasicImg * basicMarginCnt;
			//�����̹��� ������
			slideWidth += parseInt(settings.centerBoxSize[0]);
			//���� �¿� ����
			slideWidth += settings.marginCenterImg * 2;
			log("slideWidth : " + slideWidth);

			$(this).css("width", slideWidth + "px");

			var imgList = settings.imgList;

			//�̹��� ����Ʈ ���
			for (i = 0; i < imgList.length; i++) {
				var html = "<div id='" + $(this).attr("id") + "-" + i + "' style='float:left; opacity:0; position:absolute;margin:0;' class='imgWrapper' idx='" + i + "'>";
				html += "<table height='" + centerHeight + "' cellpadding='0' cellspacing='0'><tr><td valign='middle'>";
				//html += "<img draggable='false' src='" + imgList[i].src + "' onload='$.XSlide.resizeImg(this)' width='" + basicWidth + "' height='" + basicHeight + "' style='display:none;'>";
				html += "<img draggable='false' src='" + imgList[i].src + "' style='width:" + basicWidth + "px; height:" + basicHeight + "px;'>";
				html += "</td></tr></table>";
				html += "</div>";
				$(this).append(html);
			}

			var startIdx = centerIdx - ((showImgCnt - 1) / 2);
			if (startIdx < 0) {
				startIdx = imgList.length + startIdx;
			}

			var currIdx = startIdx;
			var currPositionTag = 0;

			var positionTag = (showImgCnt - 1) / 2 * - 1;

			//�߾� �̹��� ���� �̹����� �ε���
			var prev_idx = settings.centerIdx - 1;
			if (prev_idx < 0) prev_idx = imgList.length - 1;

			for (i = 0; i < showImgCnt; i++) {
				//���� idx �� imgList ���� ũ�ٸ�..
				if (currIdx >= imgList.length) currIdx = 0;

				var obj = $(this).find("#" + $(this).attr("id") + "-" + currIdx);
				obj.data("position", positionTag);
				positionTag++;

				var imgWidth = basicWidth;
				if (currIdx == settings.centerIdx) {
					imgWidth = centerWidth;
					debugger;
					$(obj).find("img").css("width", centerWidth).css("height", centerHeight);
					$(obj).css("z-index", 100);

					//$.XSlide.resizeImg($(obj).find("img"));

					if (settings.titleShow) {
						var imgTitle = settings.imgList[$(obj).attr("idx")].title;
						if (imgTitle) {
							$(obj).append("<div class='slideTitle' style='font-size:" + settings.titleFontSize + "px;margin:5px;text-align:center;'>" + imgTitle + "</div>");
						}
					}
				}

				obj.css("left", currPositionTag).css("opacity", 1);

				currPositionTag = currPositionTag + imgWidth;

				if ( currIdx == settings.centerIdx || currIdx == prev_idx ) {
					currPositionTag += centerMargin;
				} else {
					currPositionTag += basicMargin;
				}

				currIdx++;
			}

			//			var startPoint;
			//			$(this).mousedown(function (e) {
			//				startPoint = e.pageX;
			//			});
			//
			//			$(this).mouseup(function (e) {
			//				var movePoint = startPoint -  e.pageX;
			//
			//				movePoint = parseInt(movePoint);
			//
			//				if (movePoint < -5) {
			//					swiperight();
			//					e.stopPropagation();
			//				} else if (movePoint > 5) {
			//					swipeleft();
			//					e.stopPropagation();
			//				}
			//			});

			$(this)
				.swipeleft(function (e) {
					swipeleft();
					e.stopPropagation();
				})
				.swiperight(function (e) {
					swiperight();
					e.stopPropagation();
				});

			function swipeleft(jumpCnt) {
				if (typeof jumpCnt == "undefined") jumpCnt = 1;
				log("swipeleft");
				if (settings.isAnimateCnt == 0) {
					swipeSlide(slideObj, "left", settings, jumpCnt);
				} else {
					log(settings.isAnimateCnt + " ������");
				}
			}

			function swiperight(jumpCnt) {
				if (typeof jumpCnt == "undefined") jumpCnt = 1;
				log("swiperight");
				if (settings.isAnimateCnt == 0) {
					swipeSlide(slideObj, "right", settings, jumpCnt);
				} else {
					log(settings.isAnimateCnt + " ������");
				}
			}

			function tapSlide(e) {
				e.stopPropagation();
				var checkPosition = $(this).data("position");
				var checkIdx = $(this).attr("idx");

				var isCenter = false;
				if (checkPosition == 0) {
					isCenter = true;
				}

				if (isCenter) {
					var link = settings.imgList[checkIdx].link;
					if (link) {
						location.href = link;
					}
				}
				else {
					//right
					if (checkPosition < 0) {
						log("click swiperight : " + checkPosition);
						swiperight(Math.abs(checkPosition));
					}
					//left
					else {
						log("click swipeleft : " + checkPosition);
						swipeleft(Math.abs(checkPosition));
					}
				}
			}

			//$(this).find(".imgWrapper").click(tapSlide);
			$(this).find(".imgWrapper").tap(tapSlide);
		});
	};

	$.fn.XSlide.defaults = {
		basicBoxSize : [100, 75],
		centerBoxSize : [200, 150],
		marginBasicImg : 10,
		marginCenterImg : -20,
		slideWidth : "",
		showImgCnt : 3,
		centerIdx : 0,
		imgList : [],
		slideDuration : 500,
		isAnimateCnt : 0,
		titleFontSize : 15,
		titleShow : true
	};

	function vaildSetting(settings) {
		//���ð� ����
		if (! settings.imgList.length) {
			$.error("imgList�� ���޵��� �ʾҽ��ϴ�");
			return false;
		}

		if (settings.centerIdx < 0 || settings.centerIdx > settings.imgList.length) {
			$.error("centerIdx(������ : " + settings.centerIdx + ") ���� 0���� �۰ų� �̹����� �ִ� �ε����� �Ѿ����ϴ�.");
			return false;
		}

		if (settings.showImgCnt < 1 || settings.showImgCnt > settings.imgList.length) {
			$.error("showImgCnt(������ : " + settings.showImgCnt + ") ���� 1���� �۰ų� �̹����� �ִ� �ε����� �Ѿ����ϴ�.");
			return false;
		}

		//Ȧ���� �ƴϸ� ����
		if ( (settings.showImgCnt % 2) != 1 ) {
			$.error("showImgCnt���� Ȧ���� �����Ǿ�� �մϴ�.");
			return false;
		}

		return true;
	}

	//tag�� ��ǥ�� ��������
	function getLeftPosition(settings, positionTag) {
		var basicWidth = parseInt(settings.basicBoxSize[0]);
		var basicMargin = parseInt(settings.marginBasicImg);
		var centerWidth = parseInt(settings.centerBoxSize[0]);
		var centerMargin = parseInt(settings.marginCenterImg);

		//������ �� �Ǵ� ������ �̹��� ����
		var sideCnt = (settings.showImgCnt - 1) / 2;
		var centerPosition = sideCnt + 1;
		var startPostionTag = sideCnt * -1;

		var i;

		var left = 0;
		if (startPostionTag <= positionTag) {
			for(i = startPostionTag + 1; i <= positionTag; i++) {
				//����
				if (i == 0) {
					left += basicWidth;
					left += centerMargin;
				}
				//������
				else if (i == 1) {
					left += centerWidth;
					left += centerMargin;
				}
				else {
					left += basicWidth;
					left += basicMargin;
				}
			}
		} else {
			for (i = startPostionTag - 1; i >= positionTag; i--) {
				left -= basicMargin;
				left -= basicWidth;
			}
		}

		return left;
	}

	function swipeSlide(objSlide, direction, settings, jumpCnt) {
		//�̵��� ĭ��
		if (jumpCnt == undefined) jumpCnt = 1;

		//������ �� �Ǵ� ������ �̹��� ����
		var sideCnt = (settings.showImgCnt - 1) / 2;

		var startIdx = settings.centerIdx - sideCnt;
		if (startIdx < 0) {
			startIdx = settings.imgList.length + startIdx;
		}

		var endIdx = settings.centerIdx + sideCnt;
		if (endIdx >= settings.imgList.length) {
			endIdx = settings.imgList.length - endIdx;
			endIdx = Math.abs(endIdx);
		}

		log("centerIdx : " + settings.centerIdx + " / startIdx : " + startIdx + " / endIdx : " + endIdx);

		var objImgWrap;

		var slideWidth = $(objSlide).width();

		var currIdx = startIdx;
		if (direction == "right") {
			currIdx = endIdx;
		}

		var in_centerIdx = settings.centerIdx + jumpCnt;
		//���� ������(jquery effect �� ���̴� ������)
		var direction_operator = "-";
		if (direction == "right") {
			direction_operator = "+";
			var in_centerIdx = settings.centerIdx - jumpCnt;
		}

		log("direction_operator : " + direction_operator);

		//������ ID �� ã��
		if (in_centerIdx >= settings.imgList.length) {
			in_centerIdx = settings.imgList.length - in_centerIdx;
			in_centerIdx = Math.abs(in_centerIdx);
		}
		else if (in_centerIdx < 0) {
			in_centerIdx = settings.imgList.length + in_centerIdx;
		}

		log("in_centerIdx : " + in_centerIdx);

		//����� �������±װ�
		var positionTag = (settings.showImgCnt - 1) / 2 * -1;
		if (direction == "right") positionTag = Math.abs(positionTag);
		positionTag = parseInt(positionTag);

		var currPositionTag;
		var currPosition;
		var i;
		for (i = 0; i < settings.showImgCnt + jumpCnt; i++) {
			if (currIdx >= settings.imgList.length) currIdx = 0;
			else if (currIdx < 0) currIdx = settings.imgList.length - 1;

			objImgWrap = $(objSlide).find("#" + $(objSlide).attr("id") + "-" + currIdx);
			currPositionTag = objImgWrap.data("position");
			currLeft = getLeftPosition(settings, currPositionTag);
			log("========== ���� �̹��� =============");
			log("currIdx : " + currIdx);
			log("id : " + "#" + $(objSlide).attr("id") + "-" + currIdx);
			log("currPositionTag : " + currPositionTag + " / currLeft : " + currLeft);
			log("origin_jqleft : " + $(objImgWrap).position().left + " / origin_cssleft : " + $(objImgWrap).css("left"));

			//������ ���� �̹���
			if (i <= jumpCnt - 1) {
				log("action : out");

				if (settings.imgList.length == settings.showImgCnt) {
					$(objImgWrap).css("opacity", 0);
				}
				else {
					//�������� �ڽ� ������ ��ŭ �ƿ�
					var move_position = parseInt(settings.basicBoxSize[0]) * jumpCnt;
					//���������
					move_position += parseInt(settings.marginBasicImg) * jumpCnt;

					//���� �ڿ��� �̹������ٸ�..
					if ( (currPositionTag > 0 && direction == "left") || (currPositionTag < 0 && direction == "right") ) {
						//���븶�� �ϳ�����
						move_position -= parseInt(settings.marginBasicImg) * 2;
						//���Ϳ� ���� ���� �ֱ�
						move_position += parseInt(settings.marginCenterImg) * 2;
					}
					//���� �̹������..
					else if (currPositionTag == 0) {
						//���븶�� �ϳ�����
						move_position -= parseInt(settings.marginBasicImg);
						//���Ϳ� ���� ���� �ֱ�
						move_position += parseInt(settings.marginCenterImg);

						$(objImgWrap).find("img").css("width", settings.centerBoxSize[0] + "px");

						settings.isAnimateCnt += 1;
						$(objImgWrap).find("img").animate({
							width: settings.basicBoxSize[0],
							height: settings.basicBoxSize[1]
						},
						slideDuration,
						function () {
							settings.isAnimateCnt -= 1;
						});
					}

					var slideDuration = settings.slideDuration;

					$(objImgWrap).css("left", currLeft + "px");

					log("jqleft : " + $(objImgWrap).position().left + " / cssleft : " + $(objImgWrap).css("left"));
					log("width : " + $(objImgWrap).find("img").width() + " / csswidth : " + $(objImgWrap).find("img").css("width"));

					settings.isAnimateCnt += 1;
					$(objImgWrap).animate({
						opacity: 0,
						left: direction_operator + "=" + move_position
					},
					slideDuration,
					function () {
						settings.isAnimateCnt -= 1;
					});

					log(direction_operator + move_position);
				}
			}
			//�ۿ��� ���� �̹���
			else if (i >= settings.showImgCnt)  {
				log("action : in");

				var outPosition = i - settings.showImgCnt + 1;
				//���� �ʱ� ��ġ ���
				var init_position = parseInt(settings.basicBoxSize[0]) * outPosition;
				//���������
				init_position += parseInt(settings.marginBasicImg) * outPosition;

				if (direction == "left") {
					init_position = slideWidth + init_position - settings.basicBoxSize[0];

					move_position = parseInt(settings.basicBoxSize[0]) * (jumpCnt);
					move_position += parseInt(settings.marginBasicImg) * jumpCnt;
				} else {
					init_position = init_position * -1;

					move_position = parseInt(settings.basicBoxSize[0]) * jumpCnt;
					move_position += parseInt(settings.marginBasicImg) * jumpCnt;
				}
				$(objImgWrap).css("left", init_position);

				var slideDuration = settings.slideDuration;

				$(objImgWrap).css("left", init_position);

				log("jqleft : " + $(objImgWrap).position().left + " / cssleft : " + $(objImgWrap).css("left"));
				log("width : " + $(objImgWrap).find("img").width() + " / csswidth : " + $(objImgWrap).find("img").css("width"));

				settings.isAnimateCnt += 1;
				$(objImgWrap).animate({
					opacity: 1,
					left: direction_operator + "=" + move_position
				},
				slideDuration,
				function () {
					settings.isAnimateCnt -= 1;
				});

				log(direction_operator + move_position);
			}
			//���� ���� �̹���
			else if (currIdx == settings.centerIdx) {
				log("action : out_center");

				var move_position;
				if (direction == "left") {
					move_position = parseInt(settings.basicBoxSize[0]);
				} else {
					move_position = parseInt(settings.centerBoxSize[0]);
				}

				move_position += parseInt(settings.marginCenterImg);

				if (jumpCnt > 1) {
					//���� ������ �Ÿ� ���� ������ ��ŭ �⺻ �ڽ� �̹��� ������� �̵�
					move_position += parseInt(settings.basicBoxSize[0]) * (jumpCnt - 1);
					//���� ������ �̵�
					move_position += parseInt(settings.marginBasicImg) * (jumpCnt - 1);
				}

				var slideDuration = settings.slideDuration;

				$(objImgWrap).css("left", currLeft + "px");
				$(objImgWrap).find("img").css("width", settings.centerBoxSize[0] + "px");

				log("jqleft : " + $(objImgWrap).position().left + " / cssleft : " + $(objImgWrap).css("left"));
				log("width : " + $(objImgWrap).find("img").width() + " / csswidth : " + $(objImgWrap).find("img").css("width"));

				$(objImgWrap).find(".slideTitle").remove();

				settings.isAnimateCnt += 1;
				$(objImgWrap)
					.css("z-index", "50")
					.animate({
						left: direction_operator + "=" + move_position
					},
					slideDuration,
					function () {
						$(this).css("z-index", "0");
						settings.isAnimateCnt -= 1;
					});

				settings.isAnimateCnt += 1;
				objImgWrap.find("img").animate({
					width: settings.basicBoxSize[0],
					height: settings.basicBoxSize[1]
				},
				slideDuration,
				function () {
					settings.isAnimateCnt -= 1;
				});

				log(direction_operator + move_position);
			}
			//���Ͱ� �� �̹���
			else if (currIdx == in_centerIdx) {
				log("action : in_center");

				var move_position;
				if (direction == "left") {
					move_position = parseInt(settings.centerBoxSize[0]);
				} else {
					move_position = parseInt(settings.basicBoxSize[0]);
				}
				move_position += parseInt(settings.marginCenterImg);

				if (jumpCnt > 1) {
					//���� ������ �Ÿ� ���� ������ ��ŭ �⺻ �ڽ� �̹��� ������� �̵�
					move_position += parseInt(settings.marginBasicImg) * (jumpCnt - 1);
					//���� ������ �̵�
					move_position += parseInt(settings.basicBoxSize[0]) * (jumpCnt - 1);
				}

				var slideDuration = settings.slideDuration;

				$(objImgWrap).css("left", currLeft + "px");
				$(objImgWrap).find("img").css("width", settings.basicBoxSize[0] + "px");

				log("jqleft : " + $(objImgWrap).position().left + " / cssleft : " + $(objImgWrap).css("left"));
				log("width : " + $(objImgWrap).find("img").width() + " / csswidth : " + $(objImgWrap).find("img").css("width"));

				settings.isAnimateCnt += 1;
				$(objImgWrap)
					.css("z-index", "100")
					.animate({
						left: direction_operator + "=" + move_position
					},
					slideDuration,
					function () {
						settings.isAnimateCnt -= 1;

						if (settings.titleShow) {
							var imgTitle = settings.imgList[$(this).attr("idx")].title;
							if (imgTitle) {
								$(this).append("<div class='slideTitle' style='font-size:" + settings.titleFontSize + "px;margin:5px;text-align:center;'>" + imgTitle + "</div>");
							}
						}
					});

				settings.isAnimateCnt += 1;
				$(objImgWrap).find("img").animate({
					width: settings.centerBoxSize[0],
					height: settings.centerBoxSize[1]
				},
				slideDuration,
				function () {
					settings.isAnimateCnt -= 1;
				});

				log(direction_operator + move_position);
			}
			//�Ϲ� �̵� �̹���
			else {
				log("action : move");

				var move_position = parseInt(settings.basicBoxSize[0]) * jumpCnt;
				move_position += parseInt(settings.marginBasicImg) * jumpCnt;

				//���� �ڿ��� �̹������ٸ�..
				if (jumpCnt > 1) {
					if ( (currPositionTag > 0 && direction == "left") || (currPositionTag < 0 && direction == "right") ) {
						//���븶�� �ϳ�����
						move_position -= parseInt(settings.marginBasicImg) * 2;
						//��������� �ϳ� ����..
						move_position -= parseInt(settings.basicBoxSize[0]);

						//���� ����
						move_position += parseInt(settings.marginCenterImg) * 2;
						//������ ������
						move_position += parseInt(settings.centerBoxSize[0]);
					}
				}

				$(objImgWrap).css("left", currLeft + "px");

				log("jqleft : " + $(objImgWrap).position().left + " / cssleft : " + $(objImgWrap).css("left"));
				log("width : " + $(objImgWrap).find("img").width() + " / csswidth : " + $(objImgWrap).find("img").css("width"));

				settings.isAnimateCnt += 1;
				$(objImgWrap).animate({
					left: direction_operator + "=" + move_position
				},
				settings.slideDuration,
				function () {
					settings.isAnimateCnt -= 1;
				});

				log(direction_operator + move_position);
			}

			if (direction == "left") {
				currIdx++;
			} else {
				currIdx--;
			}

			if (i <= jumpCnt - 1) {
				objImgWrap.data("position", "");
			} else {
				objImgWrap.data("position", positionTag);

				if (direction == "left") positionTag = positionTag + 1;
				else positionTag = positionTag - 1;
			}
			log("�űԺο� positionTag : " + objImgWrap.data("position"));
		}

		//�߽� �̹��� �ε��� ����
		settings.centerIdx = in_centerIdx;
		log("�űԺο� centerIdx : " + settings.centerIdx);

		log("------------------ �Ϸ� -------------");
	}

	function log(msg) {
		return;
		if (typeof console != 'undefined') {
			console.log(msg);
		}
	}

	$.XSlide = {};
	$.XSlide.resizeImg = function (obj, limitWidth, limitHeight) {
		//		var originWidth = $(obj).attr("originWidth");
		//		var originHeight = $(obj).attr("originHeight");
		//
		//		if (originWidth == undefined) {
		//			var objImg = new Image();
		//			objImg.src = obj.src;
		//
		//			originWidth = objImg.width;
		//			originHeight = objImg.height;
		//
		//			$(obj).attr("originWidth", originWidth);
		//			$(obj).attr("originHeight", originHeight);
		//		}

		//		if (limitWidth == undefined) {
		//			limitWidth = $(obj).attr("width");
		//			limitHeight = $(obj).attr("height");
		//		}

		$(obj).css("width", limitWidth);
		$(obj).css("height", limitHeight);

		//���ΰ� �涧
		//		if (originWidth >= originWidth) {
		//			$(obj).removeAttr("height");
		//
		//			if (originWidth > limitWidth) {
		//				$(obj).attr("width", limitWidth);
		//			}
		//			else {
		//				$(obj).attr("width", originWidth);
		//			}
		//		}
		//		//���ΰ� �涧
		//		else {
		//			$(obj).removeAttr("width");
		//
		//			if (originWidth > limitHeight) {
		//				$(obj).attr("height", limitHeight);
		//			}
		//			else {
		//				$(obj).attr("height", originWidth);
		//			}
		//		}

		$(obj).show();
	}

})( jQuery );