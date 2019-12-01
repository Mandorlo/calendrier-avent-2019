let canvas = {
    width: 1600,
    height: 900,
}

let status = {
    on: false,
    moving: false,
    circle: {
        init_radius: 150,
        radius: 150,
    },
    finger: null,
    time: 0,
}

let svg = null;
let dot = null;

let texts = []; // the advent texts


// INIT
$(document).ready(function($) {

    svg = document.getElementById('svg');
    status.finger = svg.createSVGPoint();

    $(svg).width(window.outerWidth);
    $(svg).height(window.outerHeight);

    if (window.matchMedia("(orientation: portrait)").matches) {
        $(svg).height(window.outerWidth);
        $(svg).width(window.outerHeight);
    }

    dot = document.getElementById('masker');
    dot.setAttribute('r', status.circle.init_radius)

    // events
    svg.addEventListener("touchstart", touchstart, {passive: true});
    svg.addEventListener("mousedown", touchstart, {passive: true});

    let hammertime = new Hammer(svg, {});
    hammertime.on('tap', function(ev) {
        if (ev.tapCount != 2) return;
        $('#day').show();
    });

    /* hammertime.on('pan', function(ev) {
        console.log('pan', ev)
        dot.setAttribute('cx', (ev.center.x + ev.deltaX - $('svg').position().left) * canvas.width / $(svg).width())
        dot.setAttribute('cy', (ev.center.y + ev.deltaY - $('svg').position().top) * canvas.height / $(svg).height())
    }); */


    // init calendar
    // <iframe src="https://onedrive.live.com/embed?cid=CD2B49FC830AF4A5&resid=CD2B49FC830AF4A5%21213567&authkey=ACOuhZD1_U6rJVE" width="98" height="120" frameborder="0" scrolling="no"></iframe>*
    
    // get texts
    //let file_id = '1NKUObZIBTKEzEkJL4WP7gufCXd_6GLa_'; //'https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=' + file_id

    /* fetch("https://cors-anywhere.herokuapp.com/https://onedrive.live.com/download?cid=CD2B49FC830AF4A5&resid=CD2B49FC830AF4A5%21213567&authkey=ACOuhZD1_U6rJVE")
        .then(res => res.json()).then(r => console.log('fetch res', r))
        .catch(err => console.log('fetch err', err)) */

    // get Anna's texts
    fetch("https://dl.dropboxusercontent.com/s/xkx2bjzkju8z5hn/textes-Anna.txt")
        .then(r => r.text()).then(r => {
            // append past days texts
            texts = parseTexts(r)
            console.log('fetch res', texts);
            appendTexts(texts)
        })
        .catch(err => console.log('fetch err', err))


})

function appendTexts(texts) {
    let current_day = parseInt(moment().format('D'));
    console.log('current day', current_day)

    for (let i = 0; i < texts.length; i++) {
        if (!texts[i]) continue;
        //$('#maskReveal').append(`<text x="${positions[i].left}" y="${positions[i].top}" fill="רקג" onclick="showText(${i})">${texts[i]}</text>`);

        var newText = document.createElementNS("http://www.w3.org/2000/svg","text");
        newText.setAttributeNS(null,"x",positions[i].left);     
        newText.setAttributeNS(null,"y",positions[i].top); 
        newText.setAttributeNS(null,"font-size","54");
        newText.setAttributeNS(null,"font-weight","bold");
        newText.setAttributeNS(null,"fill","blue");

        var textNode = document.createTextNode(i.toString());
        newText.appendChild(textNode);
        newText.addEventListener('click', function() {
            showText(i)
        })

        if (i < current_day) document.getElementById("svg").appendChild(newText);
        else if (i == current_day) document.getElementById("maskReveal").appendChild(newText);
    }
}

function showText(text_num) {
    console.log("show text", text_num);
    $('#day_content').html(texts[text_num].text);
    if (texts[text_num].img) $('#day').css({'background': `url(${texts[text_num].img})`, 'background-size': 'cover'});
    else $('#day').css({'background': `rebeccapurple`});
    $('#day').show(200);
}

function parseTexts(str) {
    let texts = [];
    lines = str.split("\n");
    let day_num = 0;
    for (line of lines) {
        let new_day = /^\s*\#\s*(\d+)\s*$/g.exec(line)
        if (new_day && new_day.length > 1) {
            day_num = parseInt(new_day[1]);
            texts[day_num] = {text: ""};
        } else if (/^http/.test(line)) {
            texts[day_num].img = line.trim();
        } else {
            texts[day_num].text = (texts[day_num].text + "\n<br>" + line).trim()
        }
    }
    return texts;
}

function touchstart(evt) {
    let pt = getFingerPos(evt);
    console.log('START', evt, pt)
    status.time = moment();
    status.on = true;

    dot.setAttribute('cx', pt.x)
    dot.setAttribute('cy', pt.y)

    svg.addEventListener("touchmove", touchmove, { passive: true });
    svg.addEventListener("touchend", touchend, {passive: true});
    svg.addEventListener("mousemove", touchmove, { passive: true });
    svg.addEventListener("mouseup", touchend, {passive: true});

    //SVG('#masker').animate().move(pt.x, pt.y);
    /* if (!$('#masker').length) return console.error('no masker');
    console.log($('#masker'))
    $('#masker').animate({cx: pt.x}, {duration: 200}) */

    /* setTimeout(_ => {
        console.log('test grow', !status.moving && status.on && dist(status.finger, pt) < 5, dist(status.finger, pt))
        if (!status.moving && status.on && dist(status.finger, pt) < 5) {
            let clock = setInterval(_ => {
                status.circle.radius += 10;
                dot.setAttribute('r', status.circle.radius)
                if (!status.on || dist(status.finger, pt) > 5) clearInterval(clock);
            }, 100)
        }
    }, 200) */
}

function touchmove(evt) {
    if (!status.on) return;
    status.moving = true;
    //evt.preventDefault();
    
    let pt = getFingerPos(evt);
    dot.setAttribute('cx', pt.x)
    dot.setAttribute('cy', pt.y)
    //SVG('#masker').animate().move(pt.x, pt.y);
    //document.getElementById('masker').setAttribute('cx', pt.x)
}

function touchend(evt) {
    status.circle.radius = status.circle.init_radius;
    dot.setAttribute('r', status.circle.radius)
    status.on = false;
    status.moving = false;
    svg.removeEventListener('touchmove', touchmove, { passive: true });
    svg.removeEventListener('touchend', touchend, { passive: true });
    svg.removeEventListener('mousemove', touchmove, { passive: true });
    svg.removeEventListener('mouseup', touchend, { passive: true });
}

function getFingerPos(evt) {
    /* let pos = {
        x: (evt.touches[0].clientX - $('svg').position().left) * canvas.width / $('svg').width() ,
        y: (evt.touches[0].clientY - $('svg').position().top) * canvas.height / $('svg').height() ,
    } */
    let pos = svg.createSVGPoint();
    pos.x = evt.clientX? evt.clientX : evt.touches[0].clientX;
    pos.y = evt.clientY? evt.clientY : evt.touches[0].clientY;
    pos = pos.matrixTransform(svg.getScreenCTM().inverse());
    if (window.matchMedia("(orientation: portrait)").matches) {
        console.log('portrait');
        let x = $(svg).height() - pos.x - status.circle.radius;
        pos.x = pos.y;
        pos.y = x;
    }
    status.finger = pos;
    return pos;
}

function dist(p1, p2) {
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}

