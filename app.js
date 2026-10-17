/* TOP — рисует топ из данных, которые присылает плагин.
   D — строки "ник|фраги|смерти|в_голову|буква_скилла|скилл"
   S — первое место на странице, M — место игрока, T — всего игроков */
(function () {
	var rows = window.D || [];
	var first = window.S || 1;
	var me = window.M || 0;
	var total = window.T || rows.length;
	if (rows.length === 1 && rows[0] === '') rows = [];

	function esc(s) {
		return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	var last = first + rows.length - 1;
	var html = '';

	// туман внизу и светлячки
	html += '<div class="fog f1"></div><div class="fog f2"></div>';
	for (var f = 0; f < 18; f++) {
		html += '<i class="ff" style="left:' + ((f * 13.7 + 5) % 100) + '%;top:' + (35 + (f * 17) % 60) + '%;animation-duration:' +
			(5 + (f * 3) % 6) + 's;animation-delay:' + (-(f * 1.3) % 7) + 's"></i>';
	}

	html += '<div class="head">' +
		'<img class="kn" src="knife.png" alt="">' +
		'<div class="ttl"><h1>(.)(.) ТОП ' + first + '–' + last + ' (.)(.)</h1>' +
		'<div class="sub">Всего игроков: <b>' + total + '</b>' +
		(me ? ' &nbsp;&#9670;&nbsp; Твоё место: <b>' + me + '</b>' : '') +
		'</div></div>' +
		'<img class="mk" src="mask.png" alt="">' +
		'</div>';

	html += '<table><tr><th>#</th><th class="nick">Ник</th><th>Фраги</th><th>Смерти</th>' +
		'<th>В голову</th><th>Эфф.</th><th>Скилл</th></tr>';

	for (var i = 0; i < rows.length; i++) {
		var p = rows[i].split('|');
		var place = first + i;
		var k = +p[1], d = +p[2], h = +p[3];
		var eff = (k + d) > 0 ? Math.round(k * 100 / (k + d)) : 0;
		var hp = k > 0 ? Math.round(h * 100 / k) : 0;
		var grade = p[4] || 'L-';
		var cls = (place <= 3 ? 't' + place : '') + (place === me ? ' me' : '');

		html += '<tr class="' + cls + '">' +
			'<td class="pos">' + (place <= 3 ? '<img class="cup" src="cup' + place + '.png" width="22" height="22" alt="' + place + '">' : place) + '</td>' +
			'<td class="nick">' + esc(p[0]) + '</td>' +
			'<td>' + k + '</td>' +
			'<td>' + d + '</td>' +
			'<td>' + h + ' <small>' + hp + '%</small></td>' +
			'<td><span class="bar"><i style="width:' + eff + '%"></i></span><b class="pc">' + eff + '%</b></td>' +
			'<td><span class="sk ' + grade.charAt(0) + '">' + esc(grade) + '</span> <span class="skn">' + p[5] + '</span></td>' +
			'</tr>';
	}

	html += '</table>';
	html += '<div class="foot">Беги, если сможешь...</div>';

	var box = document.getElementById('a');
	box.innerHTML = html;

	// подгоняем под размер окна игры (и по высоте, и по ширине), чтобы всё было видно без прокрутки
	function fit() {
		box.style.zoom = 1;
		var haveH = window.innerHeight || document.documentElement.clientHeight;
		var haveW = window.innerWidth || document.documentElement.clientWidth;
		var needH = box.scrollHeight + 4;
		var needW = box.scrollWidth + 4;
		var z = 1;
		if (haveH > 50 && needH > haveH) z = Math.min(z, haveH / needH);
		if (haveW > 50 && needW > haveW) z = Math.min(z, haveW / needW);
		if (z < 0.35) z = 0.35;
		if (z < 1) box.style.zoom = z.toFixed(3);
	}
	document.documentElement.style.overflow = 'hidden';
	document.body.style.overflow = 'hidden';
	// маленькое окно — компактный режим
	var hh = window.innerHeight || document.documentElement.clientHeight;
	if (hh && hh < 520) document.body.className += ' small';
	fit();
	window.onresize = fit;
	setTimeout(fit, 300);
	setTimeout(fit, 1200);
	var imgs = box.getElementsByTagName('img');
	for (var n = 0; n < imgs.length; n++) imgs[n].onload = fit;
})();
