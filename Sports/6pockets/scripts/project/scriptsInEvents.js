


const scriptsInEvents = {

	async Bootloader_Event3(runtime, localVars)
	{
		gtag('event', 'app_open');
	},

	async Game_Event15(runtime, localVars)
	{
		localStorage.setItem("tutorial", runtime.globalVars.tutorial);
	},

	async Game_Event26(runtime, localVars)
	{
		try {
			globalThis.o3h_replay_recorder.addProperty("score_json", runtime.globalVars.score_json_as_string);
		} catch(e) {
			alert(e);
		}
	},

	async Game_Event34(runtime, localVars)
	{
		try {
			await globalThis.o3h_leaderboardData.addScore(runtime.globalVars.total_score);
			runtime.callFunction("game_over_cb");
		} catch(e) {
			runtime.callFunction("game_over_cb");
			alert(e);
		}
	},

	async Game_Event81(runtime, localVars)
	{
		window.localStorage.setItem("bmd_snooker_top_score", runtime.globalVars.score_pockets);
	},

	async Game_Event83(runtime, localVars)
	{
		gtag('event', 'game_over', {
			'score': runtime.globalVars.score_pockets,
			'preset': runtime.globalVars.creator_preset,
		});
	},

	async Creator_Event2(runtime, localVars)
	{
		gtag('event', 'creator_open');
	},

	async Creator_Event58(runtime, localVars)
	{
		gtag('event', 'creator_randomize');
	},

	async Helpers_Event35(runtime, localVars)
	{
		window.localStorage.setItem("bmd_snooker_start_muted", 0);
	},

	async Helpers_Event37(runtime, localVars)
	{
		window.localStorage.setItem("bmd_snooker_start_muted", 1);
	},

	async Replays_Event7(runtime, localVars)
	{
		globalThis.setTimeout(function() {
			document.body.style.backgroundColor = "transparent";
			document.body.style.background = "none";
		
			document.documentElement.style.backgroundColor = "transparent";
			document.documentElement.style.background = "none";
		}, 0);
	},

	async Replays_Event13(runtime, localVars)
	{
		const video_asset_id = runtime.objects.state_record.getFirstPickedInstance().instVars["video_asset_id"];
		
		if(video_asset_id >= 0) {
			try {
				const video_asset = globalThis.o3h_video_assets[video_asset_id];
				const video_component = globalThis.o3h_layout.getComponent("main");
		
				const video_asset_url = await video_asset.getVideoPath();
				await video_component.prepareVideo(video_asset_url);
		
				video_component.stop();
				video_component.start();
			}
			catch(exception) {
			}
		}
	},

	async O3h_Event3(runtime, localVars)
	{
		const callback_name = localVars.callback_name;
		
		
		runtime.globalVars.o3h_original_innerWidth = window.innerWidth;
		runtime.globalVars.o3h_original_innerHeight = window.innerHeight;
		
		window.addEventListener("resize", function() {
			if(globalThis.o3h_layout || globalThis.o3h_layout.shown) {
				return;
			}
		
			runtime.globalVars.o3h_original_innerWidth = window.innerWidth;
			runtime.globalVars.o3h_original_innerHeight = window.innerHeight;
		});
		
		const finish_bootloader = async function() {
			//runtime.goToLayout("global");
			//runtime.goToLayout("test_o3h");
		
			runtime.callFunction(callback_name);
		};
		
		globalThis.o3h_dot = document.createElement("div");
		globalThis.o3h_dot.style.height = "18px";
		globalThis.o3h_dot.style.width = "18px";
		globalThis.o3h_dot.style.background = "red";
		globalThis.o3h_dot.style.borderRadius = "50%";
		globalThis.o3h_dot.style.position = "absolute";
		globalThis.o3h_dot.style.display = "none";
		document.body.appendChild(globalThis.o3h_dot);
		
		globalThis.o3h_name = document.createElement("span");
		globalThis.o3h_name.style.fontFamily = "ChauPhilomeneOne-Regular";
		globalThis.o3h_name.style.fontSize = "42px";
		globalThis.o3h_name.style.position = "absolute";
		globalThis.o3h_name.style.background = "rgba(0, 0, 0, 0.4)";
		globalThis.o3h_name.style.borderRadius = "14px";
		globalThis.o3h_name.style.paddingLeft = "40px";
		globalThis.o3h_name.style.paddingRight = "40px";
		globalThis.o3h_name.style.paddingTop = "15px";
		globalThis.o3h_name.style.paddingBottom = "15px";
		globalThis.o3h_name.style.display  = "none";
		globalThis.o3h_name.style.zIndex = -9;
		document.body.appendChild(globalThis.o3h_name);
		
		globalThis.o3h_creator_name = globalThis.o3h_name.cloneNode();
		globalThis.o3h_creator_name.style.display = "none";
		document.body.appendChild(globalThis.o3h_creator_name);
		
		if(window.location.href.indexOf("browser=1") !== -1) {
			runtime.globalVars.debug_log = "Bypassing o3h.js because app is in browser mode, call finish_bootloader immediately";
		  	finish_bootloader();
		  	return;
		}
		
		import("/api/o3h.js").then(async function(o3h) {
			try {
				globalThis.o3h = o3h;
		
		    	o3h.Instance.ready(async function() {
					runtime.globalVars.debug_log = "o3h.js initialised successfully! o3h: " + o3h.Instance.toString();
					const asset_manager = globalThis.o3h.Instance.getAssetManager();
		
					if(globalThis.o3h.Instance.playType == o3h.PlayType.Audience) {
						runtime.globalVars.mode = runtime.globalVars.MODE_AUDIENCE;
		
						try {
							globalThis.o3h_replay_data = asset_manager.getInputAsset("replayData");
							globalThis.o3h_creator_video = asset_manager.getInputAsset("cameraVideo");
							globalThis.o3h_replay_player = await globalThis.o3h_replay_data.createReplayPlayer();
		
							let props = await globalThis.o3h_replay_player.getProperties();
							runtime.globalVars.creator_state_json = props["creator_state_json"];
							runtime.objects.score_json.getFirstInstance().setJsonString(props["score_json"]);
		
							globalThis.o3h_user_data_service = globalThis.o3h.Instance.getUserDataService();
		
							const mockUser = {
		   						Name: "Current Player",
		    					AvatarImageUrl: "https://static.wikia.nocookie.net/trailerparkboys/images/6/63/Bubbles.jpg",
							    Type: 0, // 0 for audience, 1 for host
							};
		
							const entries = [];
							for (let i = 1; i <= 15; i++) {
		 						entries.push({
		    						Rank: i,
		    						User: {
		      							Name: "Player no. " + i,
		      							AvatarImageUrl: "https://pbs.twimg.com/profile_images/1503471576032940033/IH7F1Ael_400x400.jpg",
		      							Level: 0,
		      							Type: 0,
		    						},
		    						Score: (16 - i) * 100,
		    						IsHost: false,
									IsOwner: false,
		  						});
							}
							entries.push({
								Rank: 16,
								Score: 13,
								IsHost: true,
								IsOwner: true,
								User: {
									Name: "Module Host",
									AvatarImageUrl: "https://static.wikia.nocookie.net/trailerpark/images/7/70/Phil_collins.jpg",
									Level: 0,
									Type: 1,
								},
							});
		
							const moduleUrl = await runtime.assets.getProjectFileUrl("leaderboardData.js");
							const module = await import("/" + moduleUrl);
		
							const leaderboardData = new module.LeaderboardData();
							await leaderboardData.initialize(o3h.Instance);
							/*const mock = new module.MockO3H(mockUser, entries);
							await leaderboardData.initialize(mock);*/
		
							globalThis.o3h_leaderboardData = leaderboardData;
						} catch(e) {
							alert("audience init failed: " + e.toString());
						}
					} else {
						runtime.globalVars.mode = runtime.globalVars.MODE_CREATOR;
						globalThis.o3h_replay_recorder = await o3h.Instance.createReplayRecorder();
					}
		
					finish_bootloader();
				});
		  	} catch(exception) {
				runtime.globalVars.debug_log = "Bypassing o3h.js! Exception: " + exception.toString();
				alert("o3h_init failed: " + exception.toString());
				runtime.globalVars.mode = runtime.globalVars.MODE_AUDIENCE;
		      	finish_bootloader();
		 	}
		}).catch(function(exception) {
			runtime.globalVars.debug_log = "Bypassing o3h.js! Exception: " + exception.toString();
			runtime.globalVars.mode = runtime.globalVars.MODE_AUDIENCE;
		    finish_bootloader();
		});
		
	},

	async O3h_Event5(runtime, localVars)
	{
		const callback_name = localVars.callback_name;
		const component_type = localVars.component_type;
		const split_camera = localVars.split_camera;
		
		try {
			const o3h = globalThis.o3h;
			const inst = o3h.Instance;
			var componentConfig = null;
			var layout = null;
		
			if(component_type == "camera") {
				componentConfig = new o3h.CameraComponentConfig();
				componentConfig.resolutionScale = (runtime.globalVars.mode == runtime.globalVars.MODE_AUDIENCE && split_camera) ? o3h.CameraResolutionScale.Eight : o3h.CameraResolutionScale.Quarter;
				componentConfig.cameraType = o3h.CameraType.FrontFacing;
				runtime.globalVars.o3h_camera_disposed = 0;
		
				const layout_config = {
					top: componentConfig,
					topright: componentConfig,
				};
		
				let video_component_config = {};
				if(split_camera) {
					video_component_config = new o3h.VideoComponentConfig();
					video_component_config.loop = true;
					video_component_config.url = await globalThis.o3h_creator_video.getVideoPath();
				
					layout_config.topleft = video_component_config;
				}
		
				layout = await inst.createLayout((runtime.globalVars.mode == runtime.globalVars.MODE_AUDIENCE && split_camera) ? "Top Horizonal Split with Primary on Bottom" : "Vertical Split (primary bottom)", layout_config);
		
				const topComponent = layout.getComponent("top") || layout.getComponent("topright");
				const topBounds = await topComponent.getBounds();
		
				//globalThis.o3h_dot.style.left = (topBounds.width * 0.05) + "px";
				//globalThis.o3h_dot.style.top = (topBounds.height * 0.20) + "px";
		
				globalThis.o3h_name.style[runtime.globalVars.mode == (runtime.globalVars.MODE_AUDIENCE && split_camera) ? "right" : "left"] = (topBounds.width * 0.00) + "px";
				globalThis.o3h_name.style.top = topBounds.height - (topBounds.height * 0.305) + "px";
				globalThis.o3h_name.innerHTML = "Unknown";
		
				const userDataService = inst.getUserDataService();
		
				if(userDataService) {
					const activeUserInfo = await userDataService.getActiveUserInformation();
					globalThis.o3h_name.innerHTML = activeUserInfo.Name;
		
					if(runtime.globalVars.mode == runtime.globalVars.MODE_AUDIENCE && split_camera) {
						const creatorUserInfo = await userDataService.getCreatorUserInformation();
						globalThis.o3h_creator_name.innerHTML = creatorUserInfo.Name;
						//globalThis.o3h_creator_name.style.display = "block";
						globalThis.o3h_creator_name.style.left = "0px";
						globalThis.o3h_creator_name.style.top = globalThis.o3h_name.style.top;
					}
				}
			}
			else if(component_type == "video") {
				componentConfig = new o3h.VideoComponentConfig();
				componentConfig.loop = true;
		
				layout = await inst.createLayout("Full Screen", {
					main: componentConfig,
				});
			}
		
			layout.shown = false;
			globalThis.o3h_layout = layout;
			runtime.callFunction(callback_name);
		} catch(exception) {
			runtime.globalVars.debug_log = "o3h_prepare_layout failed: " + exception.toString();
			alert("o3h_prepare_layout failed: " + exception.toString());
			runtime.callFunction(callback_name);
		}
	},

	async O3h_Event7(runtime, localVars)
	{
		const callback_name = localVars.callback_name;
		
		try {
			const o3h = globalThis.o3h;
			const inst = o3h.Instance;
			let cam_component_config = null;
			let vid_component_config = null;
			let layout = null;
		
			cam_component_config = new o3h.CameraComponentConfig();
			cam_component_config.resolutionScale = o3h.CameraResolutionScale.Quarter;
			cam_component_config.cameraType = o3h.CameraType.FrontFacing;
			runtime.globalVars.o3h_camera_disposed = 1;
		
			vid_component_config = new o3h.VideoComponentConfig();
			vid_component_config.loop = true;
			vid_component_config.url = await globalThis.o3h_creator_video.getVideoPath();
		
			const layout_config = {
				top: vid_component_config,
				bottom: cam_component_config,
			};
		
			layout = await inst.createLayout("Vertical Even Split", layout_config);
		
			globalThis.o3h_name.style.display = "none";
			globalThis.o3h_creator_name.style.display = "none";
		
			layout.shown = false;
			globalThis.o3h_layout = layout;
		
			runtime.callFunction(callback_name);
		} catch(exception) {
			runtime.callFunction(callback_name);
			alert("o3h_prepare_versus_layout failed: " + exception.toString());
		}
	},

	async O3h_Event9(runtime, localVars)
	{
		const callback_name = localVars.callback_name;
		
		try {
			const o3h = globalThis.o3h;
			const layout = globalThis.o3h_layout;
			const topComponent = layout.getComponent("top") || layout.getComponent("topright");
		
			document.body.style.backgroundColor = globalThis._backgroundColor;
			document.body.style.background = globalThis._background;
		
			document.documentElement.style.backgroundColor = globalThis._backgroundColor;
			document.documentElement.style.background = document.body.style.background = globalThis._background;
		
			globalThis.innerHeight = runtime.globalVars.o3h_original_innerHeight;
			document.getElementsByTagName("html")[0].style.paddingTop = "0px";
		
			runtime.globalVars.o3h_layout_visible = 0;
			runtime.globalVars.o3h_touch_offset = 0;
		
			globalThis.o3h_name.style.display = "none";
			globalThis.o3h_creator_name.style.display = "none";
		
			window.addEventListener("resize", function() {
				setTimeout(function() {
					runtime.callFunction(callback_name);
				}, 0);
			}, {
				once: true,
			});
		
			var event = new Event("resize");
			window.dispatchEvent(event);
		} catch(exception) {
			alert("o3h_hide_layout failed: " + exception.toString());
			runtime.callFunction(callback_name);
			runtime.globalVars.debug_log = "o3h_hide_layout failed: " + exception.toString();
		}
	},

	async O3h_Event11(runtime, localVars)
	{
		const callback_name = localVars.callback_name;
		
		try {
			const o3h = globalThis.o3h;
			const layout = globalThis.o3h_layout;
		
			const topComponent = layout.getComponent("top") || layout.getComponent("topright");
			const top_left_component = layout.getComponent("topleft");
		
			if(layout.shown) {
				return;
			}
		
			layout.shown = true;
			await layout.show();
		
			globalThis._backgroundColor = document.body.style.backgroundColor;
			globalThis._background = document.body.style.background;
		
			document.body.style.backgroundColor = "transparent";
			document.body.style.background = "none";
		
			document.documentElement.style.backgroundColor = "transparent";
			document.documentElement.style.background = "none";
		
			globalThis.o3h_creator_name.style.display = "none";
			globalThis.o3h_name.style.display = "none";
		
			if(topComponent && topComponent.startRecording) {
				var topBounds = await topComponent.getBounds();
				var topHeight = topBounds.height * 0.85;
		
				globalThis.innerHeight = runtime.globalVars.o3h_original_innerHeight - topHeight;
				document.getElementsByTagName("html")[0].style.paddingTop = topHeight + "px";
		
				runtime.globalVars.o3h_touch_offset = topHeight;
				runtime.globalVars.o3h_layout_visible = 1;
		
				globalThis.o3h_name.style.display = "block";
		
				if(globalThis.o3h_creator_name.innerHTML != "" && top_left_component) {
					globalThis.o3h_creator_name.style.display = "block";
				}
			}
			else {
				globalThis.innerWidth = runtime.globalVars.o3h_original_innerWidth;
				globalThis.innerHeight = runtime.globalVars.o3h_original_innerHeight;
				document.getElementsByTagName("html")[0].style.paddingTop = "0px";
		
				if(topComponent && topComponent.setVolume) {
					topComponent.setVolume(0);
					topComponent.start();
				}
			}
			
			if(top_left_component && top_left_component.setVolume) {
				top_left_component.start();
			}
		
			window.addEventListener("resize", function() {
				setTimeout(function() {
					runtime.callFunction(callback_name);
				}, 500);
			}, {
				once: true,
			});
		
			var event = new Event("resize");
			window.dispatchEvent(event);
		} catch(exception) {
			runtime.globalVars.debug_log = "o3h_show_layout failed: " + exception.toString();
			alert("o3h_show_layout failed: " + exception.toString());
			runtime.callFunction(callback_name);
		}
	},

	async O3h_Event13(runtime, localVars)
	{
		(async function() {
			try {
				const layout = globalThis.o3h_layout;
				const cameraComponent = layout.getComponent("top");
		
				if(typeof globalThis.frontCameraVideoAsset !== "undefined" && globalThis.frontCameraVideoAsset != null) {
					globalThis.frontCameraVideoAsset.delete();
					globalThis.frontCameraVideoAsset = null;
				}
		
				//globalThis.o3h_dot.style.display = "block";
				cameraComponent.startRecording();
		
				runtime.globalVars.o3h_front_camera_video_asset_duration = 0;
				runtime.globalVars.o3h_front_camera_recording = 1;
				//runtime.callFunction("o3h_pause_recording");
			} catch(exception) {
				runtime.globalVars.debug_log = "o3h_start_recording failed: " + exception.toString();
				//alert("o3h_start_recording failed: " + exception.toString());
			}
		})();
	},

	async O3h_Event15(runtime, localVars)
	{
		const callback_name = localVars.callback_name;
		
		try {
			const layout = globalThis.o3h_layout;
			const camera_component = layout.getComponent("top");
			const front_camera_video_asset = await camera_component.stopRecording();
		
			globalThis.o3h_front_camera_video_asset = front_camera_video_asset;
			globalThis.o3h_dot.style.display = "none";
		
			runtime.globalVars.o3h_front_camera_recording = 0;
			runtime.globalVars.o3h_camera_disposed = 1;
			runtime.callFunction(callback_name);
		} catch(exception) {
			runtime.globalVars.debug_log = "o3h_stop_recording failed: " + exception.toString();
			//alert("o3h_stop_recording failed: " + exception.toString());
			runtime.callFunction(callback_name);
		}
	},

	async O3h_Event17(runtime, localVars)
	{
		const timestamp = localVars.timestamp;
		
		try {
			const o3h = globalThis.o3h;
			const layout = globalThis.o3h_layout;
			const videoComponent = layout.getComponent("top");
		
			await videoComponent.seekVideo(timestamp);
			await videoComponent.playVideo();
		} catch(exception) {
			runtime.globalVars.debug_log = "o3h_replay_front_camera failed: " + exception.toString();
			//alert("o3h_replay_front_camera failed: " + exception.toString());
		}
	},

	async O3h_Event19(runtime, localVars)
	{
		try {
			const layout = globalThis.o3h_layout;
			const cameraComponent = layout.getComponent("top");
		
			cameraComponent.stopCamera();
			runtime.globalVars.o3h_front_camera_paused = 1;
		} catch(exception) {
			runtime.globalVars.debug_log = "o3h_pause_recording failed: " + exception.toString();
			//alert("o3h_pause_recording failed: " + exception.toString());
			runtime.callFunction(callback_name);
		}
	},

	async O3h_Event21(runtime, localVars)
	{
		try {
			const layout = globalThis.o3h_layout;
			const cameraComponent = layout.getComponent("top");
		
			await cameraComponent.restartCamera();
			runtime.globalVars.o3h_front_camera_recording = 1;
			runtime.globalVars.o3h_front_camera_paused = 0;
		} catch(exception) {
			runtime.globalVars.debug_log = "o3h_resume_recording failed: " + exception.toString();
			//alert("o3h_resume_recording failed: " + exception.toString());
			runtime.callFunction(callback_name);
		}
	},

	async O3h_Event23(runtime, localVars)
	{
		const callback_name = localVars.callback_name;
		
		try {
			globalThis.o3h_fullscreen_recorder = await globalThis.o3h.Instance.getControlManager().getFullScreenRecorder();
			runtime.callFunction(callback_name);
		} catch(exception) {
			runtime.callFunction(callback_name);
		}
	},

	async O3h_Event25(runtime, localVars)
	{
		(async function() {
			try {
				globalThis.o3h_fullscreen_recorder.startRecording();
				runtime.globalVars.o3h_fullscreen_recording = 1;
			} catch(exception) {
			}
		})();
	},

	async O3h_Event27(runtime, localVars)
	{
		const callback_name = localVars.callback_name;
		
		(async function() {
			try {
				const video_asset = await globalThis.o3h_fullscreen_recorder.stopRecording();
				runtime.globalVars.o3h_fullscreen_recording = 0;
		
				if(!globalThis.o3h_video_assets) {
					globalThis.o3h_video_assets = [];
				}
		
				globalThis.o3h_video_assets.push(video_asset);
				if(callback_name.length > 0) runtime.callFunction(callback_name);
			} catch(exception) {
				if(callback_name.length > 0) runtime.callFunction(callback_name);
			}
		})();
	},

	async O3h_Event29(runtime, localVars)
	{
		(async function() {
			try {
				globalThis.o3h_fullscreen_recorder.startRecording();
				//runtime.globalVars.o3h_fullscreen_recording = 1;
				globalThis.setTimeout(async function() {
					const video_asset = await globalThis.o3h_fullscreen_recorder.stopRecording();
					video_asset.delete();
				}, 0);
			} catch(exception) {
			}
		})();
	},

	async O3h_Event31(runtime, localVars)
	{
		try {
			runtime.setReturnValue(globalThis.o3h_video_assets.length - 1);
		} catch(exception) {
			runtime.setReturnValue(-1);
		}
	},

	async O3h_Event33(runtime, localVars)
	{
		try {
			if(globalThis.o3h_video_assets) {
				globalThis.o3h_video_assets.forEach(function(video_asset) {
					video_asset.delete();
				});
				globalThis.o3h_video_assets = null;
			}
		
			if(globalThis.o3h_front_camera_video_asset) {
				globalThis.o3h_front_camera_video_asset.delete();
			}
		} catch(exception) {
		}
	},

	async O3h_Event35(runtime, localVars)
	{
		const video_asset_id = localVars.video_asset_id;
		
		try {
			const asset_manager = globalThis.o3h.Instance.getAssetManager();
			const asset_name = globalThis.o3h.Instance.playType == o3h.PlayType.Audience ? "audFullScreenVideo" : "fullScreenVideo";
		
			var replay_data = null;
			if(globalThis.o3h_replay_recorder) {
				replay_data = await globalThis.o3h_replay_recorder.getReplayData();
			}
		
			globalThis.o3h_video_assets.forEach(function(video_asset, id) {
				if(id === video_asset_id) {
					asset_manager.addToOutput(asset_name, globalThis.o3h_video_assets[video_asset_id]);
					return;
				}
				
				video_asset.delete();
			});
		
			if(globalThis.o3h.Instance.playType != o3h.PlayType.Audience) {
				asset_manager.addToOutput("cameraVideo", globalThis.o3h_front_camera_video_asset);
				asset_manager.addToOutput("replayData", replay_data);
			}
		
			globalThis.o3h_video_assets = null;
			globalThis.o3h.Instance.completeModule(runtime.globalVars.total_score);
		} catch(exception) {
			alert(exception);
		}
	},

	async O3h_Event37(runtime, localVars)
	{
		try {
			const systemSettingsService = globalThis.o3h.Instance.getSystemSettingsService();
			systemSettingsService.showSystemSettings();
		} catch(e) {
			//alert(e);
		}
	},

	async O3h_Event39(runtime, localVars)
	{
		try {
			const systemSettingsService = globalThis.o3h.Instance.getSystemSettingsService();
			systemSettingsService.hideSystemSettings();
		} catch(e) {
			//alert(e);
		}
	},

	async Cover_Event4(runtime, localVars)
	{
		//window.localStorage.setItem("bmd_snooker_top_score", 0);
		
		runtime.globalVars.best_score = window.localStorage.getItem("bmd_snooker_top_score") || 0;
		
		runtime.globalVars.start_muted = window.localStorage.getItem("bmd_snooker_start_muted") || 0;
		
		runtime.globalVars.allow_config = window.disable_config ? 0 : 1;
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

