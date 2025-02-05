/**
 * demo.js
 
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php

 */
{
	// From https://davidwalsh.name/javascript-debounce-function.
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	let winsize = {width: window.innerWidth, height: window.innerHeight};

	const DOM = {
		intro: document.querySelector('.intro'),
		slideshowImagesWrappers: document.querySelectorAll('.slideshow__item-img'),
		slideshowImages: document.querySelectorAll('.slideshow__item-img-inner')
	};
	
	class Panel {
		constructor(el) {
			this.DOM = {el: el};

			this.DOM.logo = DOM.intro.querySelector('.intro__logo');
			this.DOM.logoImg = this.DOM.logo.querySelector('.icon--arrowup');
			this.DOM.enter = DOM.intro.querySelector('.intro__enter');
			
			this.animatableElems = Array.from(DOM.intro.querySelectorAll('.animatable')).sort(() => 0.5 - Math.random());
			
			// set layout
			this.boxRect = this.DOM.el.getBoundingClientRect();
			this.layout();

			this.isOpen = true;
			this.initEvents();
		}
		layout() {
			this.DOM.el.style.transform = `scaleX(${winsize.width/this.boxRect.width}) scaleY(${winsize.height/this.boxRect.height})`;
			document.body.classList.remove('loading');
		}
		initEvents() {
			this.DOM.enter.addEventListener('click', (ev) => {
				ev.preventDefault();
				this.close();
			});
		
			this.DOM.logo.addEventListener('click', (ev) => {
				ev.preventDefault();
				this.open();
			});

			// Window resize
			this.onResize = () => {
				winsize = {width: window.innerWidth, height: window.innerHeight};
				if ( this.isOpen ) {
					this.layout();
				}
			};
			window.addEventListener('resize', debounce(() => this.onResize(), 10));
		}
		open() {
			if ( this.isOpen || this.isAnimating ) return;
			this.isOpen = true;
			this.isAnimating = true;

			DOM.intro.style.pointerEvents = 'auto';

			anime.remove(this.DOM.logoImg);
			anime({
				targets: this.DOM.logoImg,
				translateY: [{value: '-400%', duration: 200, easing: 'easeOutQuad'}, {value: ['200%', '0%'], duration: 700, easing: 'easeOutExpo'}]
			});

			anime.remove(this.animatableElems);
			anime({
				targets: this.animatableElems,
				duration: 1200,
				delay: (t,i) => 350 + i*30,
				easing: 'easeOutExpo',
				translateX: '0%',
				opacity: {
					value: 1,
					easing: 'linear',
					duration: 400
				}
			});

			const boxRect = this.DOM.el.getBoundingClientRect();
			anime.remove(this.DOM.el);
			anime({
				targets: this.DOM.el,
				scaleX: {value: winsize.width/boxRect.width, duration: 700, delay: 300, easing: 'easeOutExpo'},
				scaleY: {value: winsize.height/boxRect.height, duration: 300, easing: 'easeOutQuad'},
				complete: () => this.isAnimating = false
			});
		}
		close() {
			if ( !this.isOpen || this.isAnimating ) return;
			this.isOpen = false;
			this.isAnimating = true;

			DOM.intro.style.pointerEvents = 'none';

			anime.remove(this.DOM.logoImg);
			anime({
				targets: this.DOM.logoImg,
				translateY: [{value: '-400%', duration: 300, easing: 'easeOutQuad'}, {value: ['200%', '0%'], duration: 700, easing: 'easeOutExpo'}],
				rotate: [{value: 0, duration: 300}, {value: [90,0], duration: 1300, easing: 'easeOutElastic'}]
			});

			anime.remove(this.animatableElems);
			anime({
				targets: this.animatableElems,
				duration: 150,
				easing: 'easeOutQuad',
				translateX: '-30%',
				opacity: 0
			});

			anime.remove(this.DOM.el);
			anime({
				targets: this.DOM.el,
				duration: 1000,
				scaleX: {value: 1, duration: 300, easing: 'easeOutQuad'},
				scaleY: {value: 1, duration: 700, delay: 300, easing: 'easeOutExpo'},
				complete: () => this.isAnimating = false
			});

			anime.remove(DOM.slideshowImages);
			anime({
				targets: DOM.slideshowImages,
				duration: 1000,
				delay: (t,i) => i*60,
				easing: 'easeOutCubic',
				scale: [1.5,1]
			});
			anime.remove(DOM.slideshowImagesWrappers);
			anime({
				targets: DOM.slideshowImagesWrappers,
				duration: 1000,
				delay: (t,i) => i*60,
				easing: 'easeOutCubic',
				translateY: ['10%','0%']
			});
		}
	}

	const panel = new Panel(DOM.intro.querySelector('.intro__box'));
 // Class Menu.
    class Menu {
        constructor(el) {
            this.DOM = {el: el};
            // Open and close ctls.
            this.DOM.openCtrl = this.DOM.el.querySelector('.action--menu');
            this.DOM.closeCtrl = this.DOM.el.querySelector('.action--close');
            this.DOM.openCtrl.addEventListener('click', () => this.open());
            this.DOM.closeCtrl.addEventListener('click', () => this.close());
            // this.DOM.openCtrl.addEventListener('mouseenter', () => {
            //     allowTilt = false;
            //     tilt.reset()
            // });
            // this.DOM.openCtrl.addEventListener('mouseleave', () => {
            //     allowTilt = true;
            // });

            // The menu items.
            this.DOM.items = Array.from(this.DOM.el.querySelectorAll('.menu__item'));
            // The total number of items.
            this.itemsTotal = this.DOM.items.length;

            // Custom elements that will be animated.
            this.DOM.mainLinks = this.DOM.el.querySelectorAll('.mainmenu > a.mainmenu__item');
            this.DOM.sidemenuLinks = this.DOM.el.querySelectorAll('.sidemenu span.sidemenu__item-inner');
            this.DOM.menulink = this.DOM.el.querySelector('.menu__item-link');
        }
        // Open the menu.
        open() {
            this.toggle('open');
        }
        // Close the menu.
        close() {
            this.toggle('close');
        }
        toggle(action) {
            if ( this.isAnimating ) return;
            // (dis)allow the main image tilt effect.
            allowTilt = action === 'open' ? false : true;
            this.isAnimating = true;
            // Toggling the open state class.
            this.DOM.el.classList[action === 'open' ? 'add' : 'remove']('menu--open');
            // After all is animated..
            const animationEnd = (pos) => {
                if ( pos === this.itemsTotal-1 ) {
                    this.isAnimating = false;
                }
            };
            // Going through each menu´s item.
            this.DOM.items.forEach((el, pos) => {
                // The inner wrapper.
                const innerEl = el.querySelector('.menu__item-inner');
                // config and inner config will have the starting transform values (when opening) and the end ones (when closing) for both the item and its inner element.
                const config = {};
                const configInner = {};
                // Direction defined in the HTML data-direction.
                // bt (bottom to top) || tb (top to bottom) || lr (left to right) || rl (right to left)
                const direction = el.dataset.direction;
                // Using 101% instead of 100% to avoid rendering problems.
                // In order to create the "reveal" effect, the item slides moves in one direction and its inner element in the opposite direction.
                if ( direction === 'bt' ) {
                    config.y = '101%';
                    configInner.y = '-101%';
                    configInner.x = '0%';
                }
                else if ( direction === 'tb' ) {
                    config.y = '-101%';
                    configInner.y = '101%';
                    configInner.x = '0%';
                }
                else if ( direction === 'lr' ) {
                    config.x = '-101%';
                    configInner.x = '101%';
                }
                else if ( direction === 'rl' ) {
                    config.x = '101%';
                    configInner.x = '-101%';
                }
                else {
                    config.x = '101%';
                    config.y = '101%';
                    configInner.x = '-101%';
                    configInner.y = '-101%';
                }
                
                if ( action === 'open' ) {
                    // Setting the initial values.
                    TweenMax.set(el, config);
                    TweenMax.set(innerEl, configInner);

                    // Animate.
                    TweenMax.to([el,innerEl], .9, {
                        ease: Quint.easeOut,
                        x: '0%',
                        y: '0%',
                        onComplete: () => animationEnd(pos)
                    });
                }
                else {
                    TweenMax.to(el, 0.6, {
                        ease: Quart.easeInOut,
                        x: config.x || 0,
                        y: config.y || 0
                    });
                    TweenMax.to(innerEl, 0.6, {
                        ease: Quart.easeInOut,
                        x: configInner.x || 0,
                        y: configInner.y || 0,
                        onComplete: () => animationEnd(pos)
                    });
                }
            });

            // Show/Hide open and close ctrls.
            TweenMax.to(this.DOM.closeCtrl, 0.6, {
                ease: action === 'open' ? Quint.easeOut : Quart.easeInOut,
                startAt: action === 'open' ? {rotation: 0} : null,
                opacity: action === 'open' ? 1 : 0,
                rotation: action === 'open' ? 180 : 270
            });
            TweenMax.to(this.DOM.openCtrl, action === 'open' ? 0.6 : 0.3, {
                delay: action === 'open' ? 0 : 0.3,
                ease: action === 'open' ? Quint.easeOut : Quad.easeOut,
                opacity: action === 'open' ? 0 : 1
            });

            // Main links animation.
            TweenMax.staggerTo(this.DOM.mainLinks, action === 'open' ? 0.9 : 0.2, {
                ease: action === 'open' ? Quint.easeOut : Quart.easeInOut,
                startAt: action === 'open' ? {y: '50%', opacity: 0} : null,
                y: action === 'open' ? '0%' : '50%',
                opacity: action === 'open' ? 1 : 0
            }, action === 'open' ? 0.1 : -0.1);

            // Sidemenu links animation.
            TweenMax.staggerTo(this.DOM.sidemenuLinks, action === 'open' ? 0.5 : 0.2, {
                ease: action === 'open' ? Quint.easeInOut : Quart.easeInOut,
                startAt: action === 'open' ? {y: '100%'} : null,
                y: action === 'open' ? '0%' : '100%'
            }, action === 'open' ? 0.05 : -0.05);

            // The "Learn how to participate" menu link.
            TweenMax.to(this.DOM.menulink, action === 'open' ? 0.9 : 0.6, {
                ease: action === 'open' ? Quint.easeOut : Quart.easeInOut,
                startAt: action === 'open' ? {x: '10%'} : null,
                x: action === 'open' ? '0%' : '10%'
            });
        }
    }
    // Initialize the Menu.
    const menu = new Menu(document.querySelector('nav.menu'));
    // Get the mouse position.
	const getMousePos = (e) => {
        let posx = 0;
        let posy = 0;
		if (!e) e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return { x : posx, y : posy }
    };
    // Gets a random integer.
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    // Equation of a line (y = mx + b ).
    const lineEq = (y2, y1, x2, x1, currentVal) => {
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;
        return m * currentVal + b;
    };

    // Some random chars.
    const chars = ['$','%','#','&','=','*','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','.',':',',','^'];
    const charsTotal = chars.length;
    
    // Randomize letters function. Used when navigating the slideshow to switch the curretn slide´s texts.
    const randomizeLetters = (letters) => {
        return new Promise((resolve, reject) => {
            const lettersTotal = letters.length;
            let cnt = 0;

            letters.forEach((letter, pos) => { 
                let loopTimeout;
                const loop = () => {
                    letter.innerHTML = chars[getRandomInt(0,charsTotal-1)];
                    loopTimeout = setTimeout(loop, getRandomInt(50,500));
                };
                loop();

                const timeout = setTimeout(() => {
                    clearTimeout(loopTimeout);
                    letter.style.opacity = 1;
                    letter.innerHTML = letter.dataset.initial;
                    ++cnt;
                    if ( cnt === lettersTotal ) {
                        resolve();
                    }
                }, pos*lineEq(40,0,8,200,lettersTotal));
            });
        });
    };

    // Hide each of the letters with random delays. Used when showing the current slide´s content.
    const disassembleLetters = (letters) => {
        return new Promise((resolve, reject) => {
            const lettersTotal = letters.length;
            let cnt = 0;
            
            letters.forEach((letter, pos) => {
                setTimeout(() => {
                    letter.style.opacity = 0;
                    ++cnt;
                    if ( cnt === lettersTotal ) {
                        resolve();
                    }
                }, pos*30);
            });
        });
    }
    
    // The Slide class.
    class Slide {
        constructor(el) {
            this.DOM = {el: el};
            // The image wrap element.
            this.DOM.imgWrap = this.DOM.el.querySelector('.slide__img-wrap');
            // The image element.
            this.DOM.img = this.DOM.imgWrap.querySelector('.slide__img');
            // The texts: the parent wrap, title, number and side text.
            this.DOM.texts = {
                wrap: this.DOM.el.querySelector('.slide__title-wrap'),
                title: this.DOM.el.querySelector('.slide__title'),
                number: this.DOM.el.querySelector('.slide__number'),
                side: this.DOM.el.querySelector('.slide__side'),
            };
            // Split the title and side texts into spans, one per letter. Sort these so we can later animate then with the 
            // randomizeLetters or disassembleLetters functions when navigating and showing the content.
            charming(this.DOM.texts.title);
            charming(this.DOM.texts.side);
            this.DOM.titleLetters = Array.from(this.DOM.texts.title.querySelectorAll('span')).sort(() => 0.5 - Math.random());
            this.DOM.sideLetters = Array.from(this.DOM.texts.side.querySelectorAll('span')).sort(() => 0.5 - Math.random());
            this.DOM.titleLetters.forEach(letter => letter.dataset.initial = letter.innerHTML);
            this.DOM.sideLetters.forEach(letter => letter.dataset.initial = letter.innerHTML);
            // Calculate the sizes of the image wrap. 
            this.calcSizes();
            // And also the transforms needed per position. 
            // We have 5 different possible positions for a slide: center, bottom right, top left and outside the viewport (top left or bottom right).
            this.calcTransforms();
            // Init/Bind events.
            this.initEvents();
        }
        // Gets the size of the image wrap.
        calcSizes() {
            this.width = this.DOM.imgWrap.offsetWidth;
            this.height = this.DOM.imgWrap.offsetHeight;
        }
        // Gets the transforms per slide position.
        calcTransforms() {
            /*
            Each position corresponds to the position of a given slide:
            0: left top corner outside the viewport
            1: left top corner (prev slide position)
            2: center (current slide position)
            3: right bottom corner (next slide position)
            4: right bottom corner outside the viewport
            5: left side, for when the content is shown
            */
            this.transforms = [
                {x: -1*(winsize.width/2+this.width), y: -1*(winsize.height/2+this.height), rotation: -30},
                {x: -1*(winsize.width/2-this.width/3), y: -1*(winsize.height/2-this.height/3), rotation: 0},
                {x: 0, y: 0, rotation: 0},
                {x: winsize.width/2-this.width/3, y: winsize.height/2-this.height/3, rotation: 0},
                {x: winsize.width/2+this.width, y: winsize.height/2+this.height, rotation: 30},
                {x: -1*(winsize.width/2 - this.width/2 - winsize.width*0.075), y: 0, rotation: 0}
            ];
        }
        // Init events:
        // Mouseevents for mousemove/tilt/scale on the current image, and window resize.
        initEvents() {
            this.mouseenterFn = () => {
                if ( !this.isPositionedCenter() || !allowTilt ) return;
                clearTimeout(this.mousetime);
                this.mousetime = setTimeout(() => {
                    // Scale the image.
                    TweenMax.to(this.DOM.img, 0.8, {
                        ease: Power3.easeOut,
                        scale: 1.1
                    });
                }, 40);
            };
            this.mousemoveFn = ev => requestAnimationFrame(() => {
                // Tilt the current slide.
                if ( !allowTilt || !this.isPositionedCenter() ) return;
                this.tilt(ev);
            });
            this.mouseleaveFn = (ev) => requestAnimationFrame(() => {
                if ( !allowTilt || !this.isPositionedCenter() ) return;
                clearTimeout(this.mousetime);

                // Reset tilt and image scale.
                TweenMax.to([this.DOM.imgWrap,this.DOM.texts.wrap], 1.8, {
                    ease: 'Power4.easeOut',
                    x: 0,
                    y: 0,
                    rotationX: 0,
                    rotationY: 0
                });
                TweenMax.to(this.DOM.img, 1.8, {
                    ease: 'Power4.easeOut',
                    scale: 1
                });
            });
            // When resizing the window recalculate size and transforms, since both will depend on the window size.
            this.resizeFn = () => {
                this.calcSizes();
                this.calcTransforms();
            };
            this.DOM.imgWrap.addEventListener('mouseenter', this.mouseenterFn);
            this.DOM.imgWrap.addEventListener('mousemove', this.mousemoveFn);
            this.DOM.imgWrap.addEventListener('mouseleave', this.mouseleaveFn);
            window.addEventListener('resize', this.resizeFn);
        }
        // Tilt the image wrap and texts when mouse moving the current slide.
        tilt(ev) {
            const mousepos = getMousePos(ev);
            // Document scrolls.
            const docScrolls = {
                left : document.body.scrollLeft + document.documentElement.scrollLeft, 
                top : document.body.scrollTop + document.documentElement.scrollTop
            };
            const bounds = this.DOM.imgWrap.getBoundingClientRect();;
            // Mouse position relative to the main element (this.DOM.el).
            const relmousepos = { 
                x : mousepos.x - bounds.left - docScrolls.left, 
                y : mousepos.y - bounds.top - docScrolls.top 
            };
            
            // Move the element from -20 to 20 pixels in both x and y axis.
            // Rotate the element from -15 to 15 degrees in both x and y axis.
            let t = {x:[-20,20],y:[-20,20]},
                r = {x:[-15,15],y:[-15,15]};

            const transforms = {
                translation : {
                    x: (t.x[1]-t.x[0])/bounds.width*relmousepos.x + t.x[0],
                    y: (t.y[1]-t.y[0])/bounds.height*relmousepos.y + t.y[0]
                },
                rotation : {
                    x: (r.x[1]-r.x[0])/bounds.height*relmousepos.y + r.x[0],
                    y: (r.y[1]-r.y[0])/bounds.width*relmousepos.x + r.y[0]
                }
            };

            // Move the image wrap.
            TweenMax.to(this.DOM.imgWrap, 1.5, {
                ease: 'Power1.easeOut',
                x: transforms.translation.x,
                y: transforms.translation.y,
                rotationX: transforms.rotation.x,
                rotationY: transforms.rotation.y
            }); 

            // Move the texts wrap.
            TweenMax.to(this.DOM.texts.wrap, 1.5, {
                ease: 'Power1.easeOut',
                x: -1*transforms.translation.x,
                y: -1*transforms.translation.y
            }); 
        }
        // Positions one slide (left, right or current) in the viewport.
        position(pos) {
            TweenMax.set(this.DOM.imgWrap, {
                x: this.transforms[pos].x, 
                y: this.transforms[pos].y, 
                rotationX: 0,
                rotationY: 0,
                opacity: 1,
                rotationZ: this.transforms[pos].rotation
            });
        }
        // Sets it as current.
        setCurrent(isContentOpen) {
            this.isCurrent = true;
            this.DOM.el.classList.add('slide--current', 'slide--visible');
            // Position it on the current´s position.
            this.position(isContentOpen ? 5 : 2);
        }
        // Position the slide on the left side.
        setLeft(isContentOpen) {
            this.isRight = this.isCurrent = false;
            this.isLeft = true;
            this.DOM.el.classList.add('slide--visible');
            // Position it on the left position.
            this.position(isContentOpen ? 0 : 1);
        }
        // Position the slide on the right side.
        setRight(isContentOpen) {
            this.isLeft = this.isCurrent = false;
            this.isRight = true;
            this.DOM.el.classList.add('slide--visible');
            // Position it on the right position.
            this.position(isContentOpen ? 4 : 3);
        }
        // Check if the slide is positioned on the right side (if it´s the next slide in the slideshow).
        isPositionedRight() {
            return this.isRight;
        }
        // Check if the slide is positioned on the left side (if it´s the previous slide in the slideshow).
        isPositionedLeft() {
            return this.isLeft;
        }
        // Check if the slide is the current one.
        isPositionedCenter() {
            return this.isCurrent;
        }
        // Reset classes and state.
        reset() {
            this.isRight = this.isLeft = this.isCurrent = false;
            this.DOM.el.classList = 'slide';
        }
        hide() {
            TweenMax.set(this.DOM.imgWrap, {x:0, y:0, rotationX:0, rotationY:0, rotationZ:0, opacity:0});
        }
        // Moves a slide to a specific position defined in settings.position.
        // Also, moves it from position settings.from and if we need to reset the image scale when moving the slide then settings.resetImageScale should be true.
        moveToPosition(settings) {
            return new Promise((resolve, reject) => {
                /*
                Moves the slide to a specific position:
                -2: left top corner outside the viewport
                -1: left top corner (prev slide position)
                0: center (current slide position)
                1: right bottom corner (next slide position)
                2: right bottom corner outside the viewport
                3: left side, for when the content is shown
                */
                TweenMax.to(this.DOM.imgWrap, .8, {
                    ease: Power4.easeInOut,
                    delay: settings.delay || 0,
                    startAt: settings.from !== undefined ? {
                        x: this.transforms[settings.from+2].x,
                        y: this.transforms[settings.from+2].y,
                        rotationX: 0,
                        rotationY: 0,
                        rotationZ: this.transforms[settings.from+2].rotation
                    } : {},
                    x: this.transforms[settings.position+2].x,
                    y: this.transforms[settings.position+2].y,
                    rotationX: 0,
                    rotationY: 0,
                    rotationZ: this.transforms[settings.position+2].rotation,
                    onStart: settings.from !== undefined ? () => TweenMax.set(this.DOM.imgWrap, {opacity: 1}) : null,
                    onComplete: resolve
                });
                
                // Reset image scale when showing the content of the current slide.
                if ( settings.resetImageScale ) {
                    TweenMax.to(this.DOM.img, .8, {
                        ease: Power4.easeInOut,
                        scale: 1
                    });
                }
            });
        }
        // Hides the current slide´s texts.
        hideTexts(animation = false) {
            if ( animation ) {
                disassembleLetters(this.DOM.titleLetters).then(() => TweenMax.set(this.DOM.texts.wrap, {opacity: 0}));
                disassembleLetters(this.DOM.sideLetters).then(() => TweenMax.set(this.DOM.texts.side, {opacity: 0}));
            }
            else {
                TweenMax.set(this.DOM.texts.wrap, {opacity: 0});
                TweenMax.set(this.DOM.texts.side, {opacity: 0});
            }
        }
        // Shows the current slide´s texts.
        showTexts(animation = true) {
            TweenMax.set(this.DOM.texts.wrap, {opacity: 1});
            TweenMax.set(this.DOM.texts.side, {opacity: 1});

            if ( animation ) { 
                randomizeLetters(this.DOM.titleLetters);
                randomizeLetters(this.DOM.sideLetters);
                TweenMax.to(this.DOM.texts.number, 0.6, {
                    ease: Elastic.easeOut.config(1,0.5),
                    startAt: {x: '-10%', opacity: 0},
                    x: '0%',
                    opacity: 1 
                });
            }
        }
    }

    // The Content class. Represents one content item per slide.
    class Content {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.number = this.DOM.el.querySelector('.content__number');
            this.DOM.title = this.DOM.el.querySelector('.content__title');
            this.DOM.subtitle = this.DOM.el.querySelector('.content__subtitle');
            this.DOM.text = this.DOM.el.querySelector('.content__text');
            this.DOM.backCtrl = this.DOM.el.parentNode.querySelector('.content__close');
            this.DOM.backCtrl.addEventListener('click', () => slideshow.hideContent());
        }
        show() {
            this.DOM.el.classList.add('content__item--current');

            TweenMax.staggerTo([this.DOM.backCtrl,this.DOM.number,this.DOM.title,this.DOM.subtitle,this.DOM.text], 0.8, {
                ease: Power4.easeOut,
                delay: 0.4,
                opacity: 1,
                startAt: {y: 40},
                y: 0
            }, 0.05);
        }
        hide() {
            this.DOM.el.classList.remove('content__item--current');

            TweenMax.staggerTo([this.DOM.backCtrl,this.DOM.number,this.DOM.title,this.DOM.subtitle,this.DOM.text].reverse(), 0.3, {
                ease: Power3.easeIn,
                opacity: 0,
                y: 10
            }, 0.01);
        }
    }

    // The Slideshow class.
    class Slideshow {
        constructor(el) {
            this.DOM = {el: el};
            // The slides.
            this.slides = [];
            Array.from(this.DOM.el.querySelectorAll('.slide')).forEach(slideEl => this.slides.push(new Slide(slideEl)));
            // The total number of slides.
            this.slidesTotal = this.slides.length;
            // At least 4 slides to continue...
            if ( this.slidesTotal < 4 ) {
                return false;
            }
            // Current slide position.
            this.current = 0;
            this.DOM.deco = this.DOM.el.querySelector('.slideshow__deco');

            this.contents = [];
            Array.from(document.querySelectorAll('.content > .content__item')).forEach(contentEl => this.contents.push(new Content(contentEl)));

            // Set the current/next/previous slides. 
            this.render();
            this.currentSlide.showTexts(false);
            // Init/Bind events.
            this.initEvents();
        }
        render() {
            // The current, next, and previous slides.
            this.currentSlide = this.slides[this.current];
            this.nextSlide = this.slides[this.current+1 <= this.slidesTotal-1 ? this.current+1 : 0];
            this.prevSlide = this.slides[this.current-1 >= 0 ? this.current-1 : this.slidesTotal-1];
            this.currentSlide.setCurrent();
            this.nextSlide.setRight();
            this.prevSlide.setLeft();
        }
        initEvents() {
            // Clicking the next and previous slide starts the navigation / clicking the current shows its content..
            this.clickFn = (slide) => {
                if ( slide.isPositionedRight() ) {
                    this.navigate('next');
                }
                else if ( slide.isPositionedLeft() ) {
                    this.navigate('prev');
                }
                else {
                    this.showContent();
                }
            };
            for (let slide of this.slides) {
                slide.DOM.imgWrap.addEventListener('click', () => this.clickFn(slide));
            }

            this.resizeFn = () => {
                // Reposition the slides.
                this.nextSlide.setRight(this.isContentOpen);
                this.prevSlide.setLeft(this.isContentOpen);
                this.currentSlide.setCurrent(this.isContentOpen);

                if ( this.isContentOpen ) {
                    TweenMax.set(this.DOM.deco, {
                        scaleX: winsize.width/this.DOM.deco.offsetWidth,
                        scaleY: winsize.height/this.DOM.deco.offsetHeight,
                        x: -20,
                        y: 20
                    });
                }
            };
            window.addEventListener('resize', this.resizeFn);
        }
        showContent() {
            if ( this.isContentOpen || this.isAnimating ) return;
            allowTilt = false;
            this.isContentOpen = true;
            this.DOM.el.classList.add('slideshow--previewopen');
            TweenMax.to(this.DOM.deco, .8, {
                ease: Power4.easeInOut,
                scaleX: winsize.width/this.DOM.deco.offsetWidth,
                scaleY: winsize.height/this.DOM.deco.offsetHeight,
                x: -20,
                y: 20
            });
            // Move away right/left slides.
            this.prevSlide.moveToPosition({position: -2});
            this.nextSlide.moveToPosition({position: 2});
            // Position the current slide and reset its image scale value.
            this.currentSlide.moveToPosition({position: 3, resetImageScale: true});
            // Show content and back arrow (to close the content).
            this.contents[this.current].show();
            // Hide texts.
            this.currentSlide.hideTexts(true);
        }
        hideContent() {
            if ( !this.isContentOpen || this.isAnimating ) return;

            this.DOM.el.classList.remove('slideshow--previewopen');

            // Hide content.
            this.contents[this.current].hide();

            TweenMax.to(this.DOM.deco, .8, {
                ease: Power4.easeInOut,
                scaleX: 1,
                scaleY: 1,
                x: 0,
                y: 0
            });
            // Move in right/left slides.
            this.prevSlide.moveToPosition({position: -1});
            this.nextSlide.moveToPosition({position: 1});
            // Position the current slide.
            this.currentSlide.moveToPosition({position: 0}).then(() => {
                allowTilt = true;
                this.isContentOpen = false;
            });
            // Show texts.
            this.currentSlide.showTexts();
        }
        // Animates the element behind the current slide.
        bounceDeco(direction, delay) {
            TweenMax.to(this.DOM.deco, .4, {
                ease: 'Power2.easeIn',
                delay: delay+delay*0.2,
                x: direction === 'next' ? -40 : 40,
                y: direction === 'next' ? -40 : 40,
                onComplete: () => {
                    TweenMax.to(this.DOM.deco, 0.6, {
                        //ease: Elastic.easeOut.config(1, 0.65),
                        ease: 'Power2.easeOut',
                        x: 0,
                        y: 0
                    });
                }
            });
        }
        // Navigate the slideshow.
        navigate(direction) {
            // If animating return.
            if ( this.isAnimating ) return;
            this.isAnimating = true;
            allowTilt = false;

            const upcomingPos = direction === 'next' ? 
                    this.current < this.slidesTotal-2 ? this.current+2 : Math.abs(this.slidesTotal-2-this.current):
                    this.current >= 2 ? this.current-2 : Math.abs(this.slidesTotal-2+this.current);
            
            this.upcomingSlide = this.slides[upcomingPos];

            // Update current.
            this.current = direction === 'next' ? 
                    this.current < this.slidesTotal-1 ? this.current+1 : 0 :
                    this.current > 0 ? this.current-1 : this.slidesTotal-1;
            
            // Move slides (the previous, current, next and upcoming slide).
            this.prevSlide.moveToPosition({position: direction === 'next' ? -2 : 0, delay: direction === 'next' ? 0 : 0.14}).then(() => {
                if ( direction === 'next' ) {
                    this.prevSlide.hide();
                }
            });
            
            this.currentSlide.moveToPosition({position: direction === 'next' ? -1 : 1, delay: 0.07 });
            this.currentSlide.hideTexts();
            
            this.bounceDeco(direction, 0.07);
            
            this.nextSlide.moveToPosition({position: direction === 'next' ? 0 : 2, delay: direction === 'next' ? 0.14 : 0 }).then(() => {
                if ( direction === 'prev' ) {
                    this.nextSlide.hide();
                }
            });

            if ( direction === 'next' ) {
                this.nextSlide.showTexts();
            }
            else {
                this.prevSlide.showTexts();
            }
            
            this.upcomingSlide.moveToPosition({position: direction === 'next' ? 1 : -1, from: direction === 'next' ? 2 : -2, delay: 0.21 }).then(() => {
                // Reset classes.
                [this.nextSlide,this.currentSlide,this.prevSlide].forEach(slide => slide.reset());
                this.render();
                allowTilt = true;
                this.isAnimating = false;
            });
        }
    }

    

    let allowTilt = true;

    // Init slideshow.
    const slideshow = new Slideshow(document.querySelector('.slideshow'));
    
    // Preload all the images in the page..
    const loader = document.querySelector('.loader');
    imagesLoaded(document.querySelectorAll('.slide__img'), {background: true}, () => document.body.classList.remove('loading'));
}
