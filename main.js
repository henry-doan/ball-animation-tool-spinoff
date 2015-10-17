/**********************************************
 * Build an animation of a ball
 * UPDATED layout
 * 
 * Update control point positions
 * 
 * - Allow keyframes to be dragged to a new frame.
 * - Ensure Remove keyframes button doesn't show
 *   for end points
 *  - Option to choose linear or cubic
**********************************************/

var BACKGROUND = color(250, 250, 250);
var BLUE = color(64, 95, 237);
var SKYBLUE = color(230, 240, 255);
var SKYBLUE2 = color(20, 100, 255);
var PINK = color(255, 0, 175);
var GREEN = color(28, 173, 123);
var ORANGE = color(255, 165, 0);
var GREY = color(140, 140, 140);
var GRIDGREY = color(230, 240, 230);
var TEXTCOL = color(20, 20, 20);
var TOOLBAR = color(235, 235, 235, 240);

var RESOLUTION = 20;

var sansFont = createFont("sans", 24);
var serifFont = createFont("serif", 24);

frameRate(24);
var FRAMES = 24;

var removeButton, speedSlider;

// Linear interpolation of the values of an array between two indices
var interpolate = function(arr, index1, index2) {
    var d = index2 - index1;
    var v1 = arr[index1];
    var v2 = arr[index2];
    
    for (var i = 1; i < d; i++) {
        arr[index1 + i] = lerp(v1, v2, i / d);
    }
};

var parabolicSpline = function(p1, p2, p3, t) {
    var rx = lerp(p1.x, p3.x, t);
    var ry = lerp(p1.y, p3.y, t);
    var sx = lerp(p3.x, p2.x, t);
    var sy = lerp(p3.y, p2.y, t);
    return {
        x: lerp(rx, sx, t),
        y: lerp(ry, sy, t),
    };
};

var cubicSpline = function(p1, p2, m1, m2, t) {
    var t2 = t * t;
    var t3 = t * t2;
    
    var a = -1 * t3 + 3 * t2 - 3 * t + 1;
    var b = t3;
    var c =  3 * t3 - 6 * t2 + 3 * t;
    var d = -3 * t3 + 3 * t2;
    
    return {
        x: p1.x * a + p2.x * b + m1.x * c + m2.x * d,
        y: p1.y * a + p2.y * b + m1.y * c + m2.y * d
    };
};

/*********************************************
 *      Creating sprites
**********************************************/
var sprites = [];
var spritesLoaded = 0;
var ballSprite = {
width: 64, height: 64, f: function() {/*!!!!!!!!!!!!!!!!!!!!!!!⅔äė6”äĜE°èĞL¼åĚ(”ßĖ♠‘ãĚà’áėć—áėĦ`áęĳ]ÞĖĳ×÷Øĩħģ_ĘĦĢ+ìģğ:ÉĥĢ+`Ĥġ™SĝĚ@GĝĜ”8!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!–ãĜe’åĝ”–åĞà’æğě”åğŊ`äğŊ”æĠŊ”åğŊ”åĞŊ“åĞŊ_ãĞŊâĄÕŊİīuŊĪĦwŊħĤyŊĦģyŊģĠzŊĠĝ%ŊğĜ(įĜĚ*ñĚĘ.¼ėĕ=pġğÖ5!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!–âĚ>‘çġ÷’éĢħ’éģŊ‘éģŊ’éģŊ’èģŊ’èĢŊ‘èĢŊ‘çġŊ”æĠŊ“åĠŊ£ðĄŊġģ:ŊĭĩvŊĭĩwŊīħxŊĩĥyŊĦĤyŊĤġzŊģğzŊĞĜ#Ŋěę$Ŋęė"ıĖĔ(ĆĒĐ>⅔ŊŊŊ1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!–çĝ@”èĢĤ’ìĦŅ’ìĥŊ’ìĦŊ’ìĦŊ‘ìĦŊ‘ìĥŊ’ëĥŊ’êĤŊ’éģŊ‘çĢŊ‘çġŊ‘çĠŊÛāàŊĵĮrŊįĪwŊĭĩwŊĭĩwŊīħxŊĨĤyŊĦĤyŊĥġzŊģğzŊğĜ#Ŋěę#Ŋęė$ŊĖē$ņđď(ĵďč_⅓!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ËÜń1‐ëĢZ–êĢú’ëĥŊ–íĦŊ’îħŊ–íĦŊ’íĦŊ’íĦŊ’ìĦŊ’ìĦŊ’ìĥŊ‘ìĥŊ’êĥŊ’èģŊ‘èĢŊ…éĜŊĄĖµŊĲĬtŊįĪwŊĮĩwŊĭĩwŊĬĨxŊĩĥyŊĨĥyŊĦĢyŊĤġzŊĢĞzŊĞě#Ŋěę$Ŋęė$Ŋĕē%Ŋđď%Ŋċĉ*ěĊĉ_røø`6!!!!!!!!!!!!!!!!!!!!!!!!!!!ŊŇcL½ðĕÁ‘ëĤĿ–íħŊ—îħŊ–ïħŊ–îĨŊ–ïħŊ–îĦŊ’îħŊ’íħŊ’ìĦŊ’ìĦŊ‘ëĥŊ’ìĥŊ’êĤŊ’éģŊ‐êĚŊĦħ,ŊıĬvŊįĪwŊįĪwŊĮĩwŊĭĩwŊīħxŊĩĥyŊħĤyŊĥġzŊģĠzŊĠĝzŊĜĚ#ŊěĘ$ŊĘĕ$ŊĔĒ%Ŋđď%ŊĉĈ(ŊăĂ*Þîñ`U!!!!!!!!!!!!!!!!!!!!!!!!!ŊĽ$gĆĚ♣Ē®ñĝŊ—ðĨŊ—ïĨŊ—ïĨŊ—ïĨŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—îħŊ–íĦŊ–ìĦŊ–ìĥŊ’ìĥŊ’ëĥŊ’êĤŊ™ìĖŊĻıpŊİīvŊİīwŊįĪwŊĮĪwŊĭĩwŊīħxŊĪĥxŊĨĤyŊĥĢzŊĥġzŊġĞzŊĞě#ŊĜę$ŊĚė$ŊėĔ$Ŋēđ%ŊĐč%ŊĊć&Ŋýü@ġáà>y!!!!!!!!!!!!!!!!!!!!!!!Ķĳ[yĹĲxłÙĆëŊ’ïĪŊ—ðĨŊ—ðĩŊ—ïĨŊ—ïĨŊ—ïĨŊ—ðĨŊ—ïħŊ—ïħŊ—ïħŊ–îĦŊ–îĦŊ–íĦŊ–ìĥŊ’ëĤŊ‘ëĥŊ¿õĄŊľĴjŊıĬwŊİĬwŊİīwŊįĪwŊĭĩwŊĬĨxŊīħxŊĨĤyŊĦģzŊĥġzŊĢğzŊğĜ#ŊĜę$ŊĚĘ$Ŋėĕ$Ŋĕē%ŊĒď%Ŋčċ&ŊĉĆ&Ŋøø(ŊÙ×<–!!!!!!!!!!!!!!!!!!!!!ĶĲ<’ķĳwŊĥĪ=Ŋ♣úĎŊ—ðĪŊ—ðĩŊ—ðĨŊ—ïĨŊ—ðĨŊ—ïĨŊ—ïĨŊ—ïħŊ—ïħŊ—îħŊ—îħŊ—îĦŊ–îĦŊ–íĦŊ’ìĥŊ”éħŊÕāëŊļĲmŊıĬwŊİĬwŊįĪwŊįĪwŊĮĩwŊĬĨxŊīħxŊĩĥyŊħĤzŊĥġzŊĤĠzŊĠĜ#ŊĜĚ#ŊěĘ$ŊĖď#Ŋėĕ%ŊēĒ%Ŋďč&Ŋċĉ&ŊĆĄ"Ŋöõ"ŊÙÚ;ÃĎĥ¢2!!!!!!!!!!!!!!!!!!ĶĲ)⅓ķĳuňĸĳtŊėģ©Ŋ…ðħŊ—ðĨŊ—ïħŊ—ïĨŊ—ïĨŊ—íĦŊ—íĦŊ—îĦŊ—îħŊ—îĦŊ—îĦŊ—îĦŊ—íĦŊ—íĦŊ–ëĥŊ–ìĥŊ“éĨŊâĈàŊĺıoŊĲĭvŊıĬwŊİīwŊįĪwŊĮĩwŊĭĩwŊīħxŊĩĥxŊħĤyŊĥĢzŊĤĠzŊĠĝ#ŊĝĚ#ŊĚĖ$ŊČïyŊāÎvŊĉî#Ŋđē%ŊĎĐ&ŊćĆ"Ŋÿþ"Ŋññ"Ŋéé.Ïòç€2!!!!!!!!!!!!!!!!ķĴ=“ĸĳvńĸĳtŊĹĳtŊąěÀŊ^ëĮŊ—ðĨŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—îħŊ—îħŊ—îĦŊ—îħŊ—îħŊ—îħŊ—ïħŊ—îħŊ—íĦŊ–ìĥŊ“éĩŊçĊÛŊĺĲoŊıĭvŊİĬwŊİīwŊįĪwŊĮĩwŊĭĩwŊīħxŊĩĥxŊħĤyŊĥĢzŊĤġzŊġĝ#ŊĝĚ#ŊĜę$ŊĘĔ$ŊćãxŊêyrŊî[tŊýÙyŊċČ"ŊĄą"Ŋøö"Ŋïï"ŊÝÞ;Á!!!!!!!!!!!!!!!ĹĴ”iķĲvŊĸĳtŊĹĳtŊĸĳuŊðđØŊ`îĮŊ—ïĨŊ—ïħŊ—ïĨŊ—îħŊ—îħŊ—îħŊ—îħŊ—îĦŊ—îĦŊ—îħŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—îĦŊ”ëĪŊëčÙŊĹĲoŊĲĭvŊİĬwŊİīwŊįīwŊĮĩwŊĭĩwŊĬħxŊĪĦxŊĨĤyŊĥĢzŊĥġzŊġĞ#ŊĝĚ#ŊĜę$ŊĚĘ$ŊĘĘ$ŊďĄ#ŊçutŊãqtŊâ%sŊ÷Û#Ŋýþ"Ŋóò"Ŋïï"ŊÑÐ>?!!!!!!!!!!!!!ĹĴ™QķĳyļĸĳsŊĹĳtŊĹĴtŊķĳvŊÝĈêŊ”íĭŊ—ïĨŊ—ïħŊ—îħŊ—ïħŊ—ïħŊ—ïĨŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—ïĨŊ”îīŊìĎÛŊĺĲoŊĲĮvŊıĬwŊİĬwŊįīwŊĭĩwŊĭĩwŊĬħxŊĩĥxŊĨĤyŊĥĢzŊĤĠzŊġĞ#ŊĝĚ#ŊĜę#ŊĚĘ$ŊĘĖ$ŊĖĔ%ŊĎą#Ŋë?uŊßorŊØgpŊß‘vŊìÞ$Ŋòò"Ŋìì(ŊÕÖ]p!!!!!!!!!!!Ķĳ†9ķĳ#ąĹĳtŊĹĳtŊĹĴtŊĹĴtŊķĳwŊÓĄüŊ‘îĬŊ—ïĨŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—ïĨŊ—ïħŊ…ïħŊ—ïħŊ—ïħŊ—ïħŊ—ïħŊ—ïĨŊ—ïĨŊ—ïĨŊ‘îĬŊèčÝŊĺĳoŊĳĮvŊıĭvŊİīwŊİīwŊĮĩwŊĭĩwŊīħxŊĩĥxŊħĤyŊĥĢzŊĤĠzŊġĞ#ŊĝĚ#ŊĜę$ŊĚĘ$ŊĘĖ$ŊĕĒ%Ŋēđ%Ŋċþ$Ŋè<uŊÛnoŊÕosŊÍ$wŊÛ«zŊòò&Ŋèè(Ĝ¾’+M!!!!!!!!!!ķĲ(«ĸĳuŉĹĳtŊĹĴtŊĹĴtŊĺĴsŊĸĳvŊÉÿăŊ‘îīŊ—ïĨŊ—ïħŊ—ïĨŊ—ïĨŊ‐ðĨŊ…ðĨŊ…ðĨŊ‐ðĨŊ‐ðĨŊ…ïĨŊ—ïħŊ—îħŊ—îħŊ—ïħŊ—ðĨŊ’ïīŊåčâŊĺĳnŊĳĮvŊıĭvŊİīwŊİīwŊĮĩwŊĮĩwŊĬĨxŊĩĦxŊħĤyŊĥĢzŊĤĠzŊġĞ#Ŋĝě#ŊĜę#ŊĚĘ$ŊĘĖ$ŊĕĒ%Ŋēđ%ŊĐď&Ŋćü%ŊÞuqŊØrsŊÍvvŊÃxxŊÌ^zŊëã$ŊÑ♥&ÑVN^3!!!!!!!!ķĳ,Tķĳ#ıĹĳtŊĹĳtŊĹĴtŊĹĴtŊĺĴsŊĸĳvŊÄýĄŊ‘îĪŊ—ïħŊ—ïħŊ…ïĨŊ‒ðĨŊ°ðĨŊ®ñĩŊ™òĩŊ™ñĩŊ°ñĩŊ‒ðĨŊ‒ðĨŊ…ïħŊ…ïħŊ…ïħŊ…ðĨŊ’ïīŊÚćíŊļĴmŊĳĮvŊĲĮvŊİĬwŊİīwŊĮĩwŊĭĩxŊīĦxŊĨĤyŊĦģyŊĥĢzŊģġzŊġĝ#ŊĝĚ#ŊĜę#ŊĚĘ$ŊĘĖ$ŊĕĒ%ŊēĐ%Ŋďč%Ŋčċ&Ŋăû%Ŋ×ptŊÎvuŊÄxwŊÃxxŊÉ;yŊÌ–zŅ♠#.f!!!!!!!!ķĳ*ÜĸĳsŊĹĳtŊĹĴtŊĹĴtŊĺĴtŊĻĴsŊĹĴvŊÃüĄŊ‘íĪŊ—îħŊ‐ïħŊ©ñĨŊ¼óĩŊ¢öīŊ♠øīŊ♦ùĬŊ♣ùĬŊ€öīŊ⅔ôĪŊ®ñĩŊ‒ðĨŊ‐îħŊ…ïħŊ—ïħŊ’ïĪŊÌāýŊĿĵkŊĳĮvŊĲĮvŊıĬwŊįĪwŊĮĩwŊĭĩxŊīħxŊĩĥyŊĦģyŊĥĢzŊĤğzŊĠĝ#ŊĝĚ#Ŋěę#ŊĚė$ŊĘĕ$Ŋĕē%ŊēĐ%Ŋďč%ŊČĊ&ŊĈć"ŊöÞzŊÏvvŊÄwwŊÃwyŊÂxxŊÂwwŊ€$#ă!!!!!!!Ĺĳ¼bĸĳwŊĹĳtŊĹĳtŊĹĴtŊĺĴtŊĺĴsŊĻĴsŊĸĳvŊÅýăŊ‘íĪŊ‐ïħŊ™òĩŊ¢öīŊÃüĭŊÐĂįŊØąİŊÛćıŊØąİŊÐāįŊÃûĬŊ¢õĪŊ™òĩŊ‒ïħŊ‐ïħŊ…ïħŊ–ïĨŊ♠ùďŊłķiŊĳįvŊĲĭvŊİīwŊįīwŊĮĩwŊĭĩxŊīħxŊĩĤyŊĦģzŊĥġzŊģĠzŊĠĝ#ŊĝĚ#ŊěĘ$Ŋęė$Ŋėĕ$ŊĕĒ%ŊēĐ%Ŋďč%ŊČĊ&Ŋćą"ŊāĀ"Ŋá♠zŊÅxwŊÃxwŊÃxwŊÃxwŊÁwxŊ¾*@+!!!!!!ķĳ@ĀĸĳsŊĸĳtŊĺĴtŊĹĴtŊĺĴsŊĻĴsŊĻĴsŊĹĴvŊÌÿĂŊ’íĪŊ™ñĨŊ€÷īŊÌāįŊßĊĲŊðđĵŊúėķŊýĘĸŊ÷ĔĶŊêĎĴŊÙĆıŊÇýĭŊ‡õĪŊ©ñĨŊ‐ïħŊ‐ïħŊ—ïħŊ½óĜŊĿĵpŊĳįvŊĲĭvŊİīwŊįīwŊĮĩwŊĬĨxŊĪĦxŊĨĥyŊĥĢzŊĤġzŊģğzŊğě#ŊĜĚ#ŊěĘ$Ŋęė$Ŋėĕ%ŊĔđ%ŊĒĐ%Ŋďč%ŊČĊ&Ŋćą"Ŋāā"Ŋöò&ŊÊ:yŊÃywŊÃxwŊÃxwŊÄxwŊ»wxĥ!!!!!ĴĤ⅓dĶıuŅĸĳtŊĸĳtŊĹĴtŊĺĴtŊĺĴsŊĻĴsŊĻĴsŊĺĴvŊÔăúŊ…îīŊµöīŊÌāįŊæčĴŊÿĚĸŊĐĥļŊęĪĿŊĚīĿŊĔħĽŊąĜĹŊîĐĴŊ×ĄİŊÁúĬŊ½óĩŊ‐ðĨŊ‐ðĨŊ…ïĨŊ°òĞŊĵİ$ŊĳįuŊıĭwŊİīwŊįĪwŊĭĩwŊĬĨxŊĪĦxŊħģzŊĥĢzŊĤġzŊĢĞzŊĞě#ŊĜę#ŊěĘ$Ŋęė$ŊĖĔ%ŊĔđ%ŊĒď%ŊďČ&Ŋċĉ&ŊĆą"ŊĀĀ"Ŋùú"ŊåÑ$ŊÃxxŊÃxwŊÃxwŊÃxwŊÃyyŅ⅓")=!!!!ģĀ$ØķĲuňĸĳtŊĹĳtŊĹĴtŊĺĴtŊĺĴsŊĻĴsŊļĵsŊĺĴuŊßĉïŊ®ðĮŊÃýĭŊàċĳŊĀěĹŊĘĪľŊħĴłŊįĹńŊİĹńŊĨĴłŊęĪľŊăĜĹŊæČĳŊËÿĮŊµöĪŊ°ñĩŊ‒ðĨŊ…ðĨŊ©òġŊģĨ]ŊĴįtŊıĬwŊİīwŊĮĩwŊĭĩxŊĬĨxŊĪĦyŊħģzŊĥġzŊĤĠzŊġĝzŊĞě#ŊĜę#ŊěĘ$ŊĘĖ$ŊĖĔ%ŊĔđ%Ŋđď%Ŋčċ&ŊċĈ&ŊĆĄ"Ŋÿÿ"Ŋ÷õ"Ŋõú(ŊÒ°yŊÂtwŊÃxwŊÃxwŊÃyxŊ♣z#ô!!!ëS‘EĬėwēĸĲtŊĹĳtŊĹĴtŊĹĴtŊĺĴtŊĻĴsŊļĵsŊļĵsŊĻĴuŊíďäŊ⅓óİŊÑăıŊóĔĶŊĒħĽŊĩĵŃŊķľņŊĽńňŊľłňŊĶĽņŊĦĲŁŊĐĤļŊñĒĵŊÒăİŊ«øĬŊ©òĪŊ‒ðĨŊ‐ðĨŊ©òģŊďĞ⅓ŊĵįsŊİĬwŊİīwŊĮĪwŊĬĨxŊīĦxŊĩĥyŊĦģyŊĤġzŊģğzŊĠĝzŊĝĚ#ŊěĘ$ŊĚė$ŊĘĕ$Ŋĕē%Ŋēđ%ŊđĎ%ŊčĊ&Ŋĉć&ŊąĄ"Ŋÿý"Ŋöõ"Ŋòò"Ŋîê"ŊÆ%wŊÃwwŊÃxwŊÃxwŊÀ#zĥ¾,,Z!!ĝì#xĳĥvķĸĳtŊĹĳtŊĹĴtŊĺĴsŊĺĴtŊĻĴsŊļĵsŊļĵsŊĻĵtŊþĘÕŊµöĲŊÝĉĲŊĀěĸŊĞĮŀŊĴĻņŊŀńŉŊňŉŊŊŅňŊŊļŁňŊĬķŃŊĔħľŊõĔĶŊÔĄİŊ♠ùĬŊ®òĩŊ‒ðĨŊ…ðĨŊ‒ðĥŊûĕÄŊķİrŊİĬwŊįĪwŊĮĪwŊĬĨxŊĪĦxŊĨĥyŊĦĢzŊĤġzŊĢĞzŊĞě#ŊĜę#ŊěĘ$Ŋęė$ŊėĔ$ŊĕĒ%ŊĒĐ%ŊĐĎ%ŊČĊ&ŊĈĆ"ŊĄĂ"Ŋýý"Ŋôô"Ŋòò"Ŋòô"ŊÅ#vŊÃwwŊÃxwŊÃxwŊÁzxň♦%%]!!ĬĘ%¾ĵĭuŊĸĳtŊĹĳtŊĹĴtŊĺĴtŊĺĴsŊĻĴsŊļĵsŊļĵsŊļĵtŊĎğÆŊ€øĴŊáċĳŊąĞĺŊģİŁŊķľņŊŃŇŊŊŊŊŊŊŇŉŊŊļŁňŊīĶŃŊĒĦĽŊóēĶŊÓăİŊ»ùĬŊ®ñĨŊ‐ðĨŊ…ïħŊ…ïĦŊåċßŊĸıoŊİīwŊįĪwŊĮĩwŊĬĨxŊĩĥxŊħĤyŊĥġzŊĤĠzŊĢĞzŊĝě#ŊĜę$ŊĚė$Ŋęė$ŊĖĔ$ŊĔĒ%ŊĒď%ŊĎČ&ŊČĉ&ŊĈĆ"ŊăĂ"Ŋûú"Ŋôò"Ŋóõ"ŊÜ¿#ŊÀrxŊÃxwŊÃxwŊÃxwŊÂvvŊ♥%&Ô¢‡•4Ġü]7İĢ%èĸĳtŊĹĳtŊĹĳtŊĹĴtŊĺĴtŊĻĴsŊĻĴsŊļĵsŊļĵsŊļĵsŊęĥµŊ♥úĴŊáċĳŊăĝĺŊĠįŀŊĳĻŅŊľŃňŊŃŇŉŊŀŅŉŊĵĽŅŊģıŁŊĊġĻŊêďĴŊÌĀĮŊµöīŊ°ñĨŊ‐ïħŊ…îħŊ–íĦŊÒāñŊĶįsŊįīwŊĮĩwŊĭĨwŊĪĦxŊĩĥyŊħģzŊĥġzŊģğzŊĠĝzŊĝĚ#Ŋěę$ŊĚė$ŊĘĕ$Ŋĕē%Ŋēđ%ŊđĎ%ŊĎċ&ŊċĈ&Ŋćą"ŊāĀ"Ŋùø"Ŋóó"Ŋìå&ŊÄyxŊÃywŊÃxwŊÃxwŊÃxwŊÃxwŊ♥$#Ďµ"&CĲħ&EĵĭzĜĸĳtŊĹĳtŊĹĴtŊĹĴtŊĺĴtŊĻĴsŊĻĴsŊļĵsŊļĵsŊļĵsŊğĨ‒ŊÂüīŊÚćĲŊúĘĸŊĖĩľŊĩĴłŊĴļņŊķľņŊĳĻŅŊħĳłŊĔħĽŊúĘķŊÛćıŊÂúĭŊ¼òĨŊ‐ïħŊ‐ïħŊ…íĦŊ–íħŊÅûÿŊĪĩ(ŊįīwŊĮĩwŊĬĨxŊĪĦyŊĨĤyŊĥĢzŊĤĠzŊĢĞ#ŊĝĚ#ŊĜĚ#ŊěĘ$ŊęĖ$Ŋėĕ$ŊĕĒ%ŊēĐ%ŊĐĎ%Ŋčċ&ŊĊć&Ŋąă"Ŋþþ"Ŋ÷ö"Ŋòò"ŊÏ–#ŊÃyxŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÀ##ŀ♠wxIĵĮ)JĶİ$ŅĹĳtŊĹĳtŊĹĴtŊĹĴtŊĺĴtŊĻĴsŊĻĴsŊļĵsŊļĵsŊļĵsŊĦī“ŊÊĀĜŊÎĂıŊìĐĵŊąĞĺŊėĪľŊĢİŀŊĤıŁŊğĮŀŊĔħĽŊĀĚĸŊæČĳŊÌĀĮŊ€öĪŊ©ðĨŊ‐îħŊ…íĥŊ—ìĥŊ—ìĥŊ»õČŊĝĢ[ŊįĪwŊĮĩwŊĬĨxŊĪĦyŊĨĤyŊĥĢzŊģĠzŊġĝ#ŊĝĚ#ŊĜę#Ŋěė$ŊĘĖ$ŊĖĔ%ŊĔđ%ŊĒď%ŊĎČ&ŊČĊ&ŊĉĆ&ŊăĂ"Ŋýü"Ŋöõ"ŊßÅ#ŊÃywŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÄxwŊ¿vuŊÌ°…gķİ;hķĲuŊĸĳtŊĹĳtŊĹĴtŊĹĴtŊĺĴtŊĻĴsŊĻĴsŊļĵsŊļĵsŊļĵsŊĮĮ:ŊÎĂČŊÁüĮŊÖąıŊíĐĴŊþęķŊĈğĺŊĉĠĻŊĄĜĹŊ÷ĔĶŊäċĲŊÏāįŊ♣øīŊ•ðĨŊ‒îħŊ‐íĦŊ…ìĥŊ—ìĥŊ—ìĥŊ®îĜŊďĜ®ŊİĪvŊĮĩwŊīħxŊĩĥyŊħĤyŊĥġzŊģğzŊğĜ#ŊĜĚ#ŊĜę$ŊĚė$Ŋėĕ$ŊĖĔ%ŊēĐ%Ŋđď%Ŋčċ&ŊċĈ&ŊćĆ&ŊāĀ"Ŋûû"Ŋëß%ŊÆ&wŊÃwwŊÃxwŊÄxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃwuŊ€<.”ķı<;ķĲtŊĸĳtŊĹĳtŊĹĴtŊĹĴtŊĺĴtŊĻĴsŊĻĴsŊĻĴsŊļĵsŊļĵsŊķĳ$ŊÕąüŊ†õĬŊÃüĭŊÓăįŊàĉĲŊèČĳŊéčĴŊäĊĲŊÚąİŊËþĭŊ♣÷ĪŊ¼ñĨŊ‒îĦŊ‐íĥŊ‐ìĥŊ—ëĥŊ—ìĥŊ–ëĥŊ^çĨŊĀĕ♥ŊİĪwŊĭĩwŊīĦxŊĩĥyŊħģzŊĥġzŊģğzŊğĜ#ŊĜĚ#ŊěĘ$ŊęĖ$ŊĖĔ$ŊĔĒ%ŊĒĐ%ŊĐč&ŊčĊ&Ŋĉć&Ŋąă"ŊĀĀ"Ŋôí&ŊÊ<wŊÂuxŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÅywŊ£("ÈĶı?¢ķĲtŊĸĳtŊĹĳtŊĹĳtŊĹĴtŊĺĴtŊĺĴtŊĺĴsŊĻĴsŊĻĴsŊļĵsŊŀķqŊáċìŊ°ñĪŊ†õĪŊ♥øīŊÆüĭŊÊþĭŊËþĮŊÇüĭŊ¿øīŊ¢ôĩŊ•ðĦŊ‒íĦŊ‐íĥŊ‐íĥŊ—ìĥŊ—ëĤŊ–ëĤŊ–ëĤŊ^æĨŊåĈÚŊĭĩyŊĬĩxŊīħxŊĩĥyŊĥĢzŊĥġzŊĢĞ#ŊĞě#ŊĜę#ŊěĘ$ŊęĖ$ŊĖĔ%ŊĔđ%Ŋđď%ŊĎČ&Ŋċĉ&ŊĈĆ"Ŋăă"Ŋû÷&ŊÒ?xŊÁvxŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÄxwŊ«)(ãĶĲ;ÓķĲtŊĸĳtŊĹĳtŊĹĴtŊĹĴtŊĹĴtŊĺĴsŊĺĴsŊĻĴsŊĻĴsŊļĵsŊŁķnŊöĔÖŊ©ñħŊ°ðĨŊ½ñĩŊ⅔óĩŊµôĩŊµõĪŊ⅔óĩŊ½ñĨŊ°îĦŊ‐íĥŊ‐íĥŊ‐íĥŊ—ìĥŊ—ìĥŊ–ëĤŊ–ëĤŊ’êĤŊ“çĦŊÆùùŊĩħ$ŊĬĨxŊĪĦxŊĨĤyŊĥġzŊĤġzŊġĞzŊĞĚ#Ŋěę#ŊěĘ$ŊĘĖ$Ŋĕē%Ŋēđ%ŊđĎ%Ŋčċ&ŊċĈ&Ŋćą"Ŋÿû&ŊÚ‘wŊÅxyŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxwŊÃxvŊÆ,+ĄĸĴ`âķĲsŊĸĳtŊĸĳtŊĹĴtŊĹĴtŊĹĴtŊĺĴsŊĺĴsŊĻĴsŊĻĴsŊĻĴsŊľĶpŊďĠ£Ŋ™òġŊ‒ïħŊ‐ïħŊ‒ðĨŊ°ðĨŊ°ïĨŊ‒ïħŊ‐íĦŊ…íĦŊ…íĥŊ‐ìĥŊ—ìĥŊ—ìĥŊ—ìĥŊ—ëĤŊ–êĤŊ’éģŊ‘èģŊ’çěŊĨĨ"ŊīħxŊĪĦxŊħĤzŊĥġzŊĤĠzŊĠĝzŊĝĚ#ŊĜę$ŊĚė$ŊĘĖ$ŊĕĒ%Ŋēđ%ŊĐĎ%Ŋčċ&ŊĊĈ&Ŋāú&Ŋã½xŊËsvŊÂwwŊÃvwŊÂuwŊÂuwŊÂuwŊÂwwŊÃxwŊÄywŊÃywŊÃxwŊÃxvŊ♥)+ďķĳ“áķĲtŊĸĳtŊĸĳtŊĹĳtŊĹĴtŊĹĴtŊĹĴtŊĺĴsŊĺĴsŊĻĴsŊĻĴsŊĽĵqŊĨī[Ŋ•óĜŊ…ïĨŊ…ïħŊ…ïħŊ…ïĦŊ…íĦŊ…íĦŊ…íĥŊ—ìĥŊ…ìĤŊ—ëĤŊ—ìĥŊ—ìĥŊ—ëĥŊ–ëĤŊ’êģŊ’èĢŊ‘çĢŊ:àĨŊĐĜ‐ŊĬħwŊĩĥxŊĦģzŊĥġzŊģĠzŊğĜ#ŊĜĚ#Ŋěę$ŊĚė$Ŋėĕ%ŊĕĒ%ŊēĐ%Ŋďč%Ŋčċ&Ŋąþ%Ŋè¾vŊÙ+uŊÖ“yŊÒ‐xŊÓ™zŊÖ⅓#Ŋ×µ#ŊÚ♠#ŊÜÁ$ŊÞÄ%ŊàÈ$ŊÐ‐#ŊÂvxŊÃwvŊÊ_;ďķĲ=ÒķĲtŊĸĳtŊĸĳtŊĸĳtŊĹĴtŊĹĴtŊĹĴtŊĺĴtŊĺĴtŊĺĴsŊĺĴsŊĻĴsŊłķoŊ†öėŊ—ïħŊ—ïħŊ—îĦŊ—íĦŊ—íĦŊ—ìĥŊ—ìĥŊ—ëĤŊ—ëĤŊ–ëĤŊ—ëĥŊ—ëĤŊ–ëĤŊ–êĤŊ’èģŊ‘çĢŊ”æĠŊ?áĢŊâĄÖŊĭħtŊĨĥyŊĦģzŊĤġzŊĢğzŊğĜ#ŊĜĚ#ŊěĘ$Ŋęė$Ŋėĕ%ŊĔđ%ŊĒď%Ŋďč%ŊČĊ&Ŋćă&Ŋýï&Ŋ÷ï&Ŋóì"Ŋñì&Ŋòî&Ŋñð"Ŋòñ"Ŋòó"Ŋòô"Ŋóô"Ŋô÷(ŊÞÅ$ŊÁswŊÁuwŊØ¢:ÿĶĳ?⅔ķĲtŊĸĳtŊĸĳtŊĸĳtŊĸĳtŊĹĴtŊĹĴtŊĹĴtŊĹĴtŊĺĴtŊĺĴtŊĺĴsŊńĹiŊÓăøŊ–íĨŊ—îħŊ—íĦŊ—íĦŊ—ìĥŊ—ëĥŊ—ëĥŊ–ëĤŊ–ëĤŊ–ëĤŊ—ëĤŊ—ëĤŊ–êģŊ’éģŊ‘èĢŊ‘çĢŊ”äĝŊ_âĜŊ½èćŊĳīqŊħģyŊĥġzŊĤġzŊġĝzŊĞě#ŊĜę#ŊĚĘ$ŊĘĖ$ŊĖĔ%Ŋēđ%ŊĒď%ŊĎČ&Ŋċĉ&ŊĆą"ŊĂā"Ŋûú"Ŋøö"Ŋøö"Ŋ÷ô"Ŋóó&Ŋòñ&Ŋññ"Ŋòñ"Ŋòò"Ŋóô"ŊâÏ&ŊÁrwŊÃtwŊÍ‡"àķĲ=*ĶĲuŊĸĳuŊĸĳtŊĸĳtŊĸĳtŊĹĳtŊĹĳtŊĹĳtŊĹĴtŊĹĴtŊĹĴtŊĺĴtŊĿĶnŊÿĘÅŊ”ìĪŊ—íĦŊ—ìĦŊ—ìĥŊ—ìĥŊ—ìĥŊ—ìĥŊ—ëĤŊ—ëĤŊ–ëĤŊ–ëĤŊ–êĤŊ’êģŊ’èģŊ‘çĢŊ”åğŊ`ãěŊ`áėŊ,ÜĝŊğĠ:ŊĨĤxŊĥġyŊĤĠzŊġĝzŊĝĚ#Ŋěę$ŊĚĘ$ŊĘĕ$Ŋĕē%Ŋēđ%ŊĐď%Ŋčċ&ŊĊĈ&ŊĆĄ"ŊĀÿ"Ŋúù"Ŋúø"Ŋù÷"Ŋø÷"Ŋøõ"Ŋõó"Ŋôò"Ŋòò"Ŋòñ"Ŋòó"ŊæÔ&Ŋ¿pvŊÄwwŊ×Ê.ÂĸĴ‘bĶĲxŊķĲuŊķĲuŊĸĳtŊĸĳtŊĸĳtŊĹĳtŊĹĳtŊĹĳtŊĹĴtŊĹĴtŊĹĴtŊĻĵrŊĭĭ;Ŋ[èĭŊ—ìĥŊ—ìĥŊ—ìĥŊ—ìĥŊ—ìĥŊ—ëĥŊ—ëĤŊ–êĤŊ–êĤŊ–êĤŊ’éģŊ’èĢŊ’çĢŊ”åĠŊ“ãĜŊ`âęŊ_àĖŊ?ÝĘŊêĆÆŊīĥtŊĥġzŊģĠzŊğĜ#ŊĜĚ#Ŋěę$Ŋęė$ŊėĔ$ŊĔĒ%ŊēĐ%ŊĐĎ%ŊčĊ&ŊĊć&ŊąĄ"Ŋþý"Ŋýú"Ŋüú"Ŋùø"Ŋùø"Ŋù÷"Ŋøö"Ŋöõ"Ŋôò&Ŋóò&Ŋòó"ŊæÕ&Ŋ¿ovŊÈ,xŊÙÍ_[įġ$JĲĩxĽķĲuŊĸĳuŊĸĳtŊĸĳtŊĸĳtŊĸĳtŊĹĳtŊĹĳtŊĹĳtŊĹĳtŊĹĴtŊĹĳtŊłĸlŊ½ñĘŊ–ëħŊ–ëĥŊ—ìĥŊ—ëĥŊ–ëĥŊ—ëĤŊ–êĤŊ–êģŊ–êģŊ’éģŊ’èĢŊ’çĢŊ‘æğŊ“äĝŊ`áęŊ_àĘŊ^ßĕŊ]ÝĔŊ‡ê÷ŊıĨqŊĤĠzŊġĞzŊĞě#ŊĜĚ#ŊĚĘ$ŊęĖ$ŊĖĕ$ŊĔĒ%ŊĒď%Ŋďč%ŊČĉ&ŊĈĆ"ŊăĂ"Ŋþþ"Ŋþý"Ŋýü"Ŋýü"Ŋûú"Ŋúø"Ŋúø"Ŋù÷"Ŋ÷ö"Ŋõó&Ŋõô"ŊäÒ%ŊÀnxŊÌ‘#ŊÙÆ‘Zĉ♠#CġûxđķĴuŊķĲuŊķĲuŊĸĳuŊĸĳtŊĸĳtŊĸĳtŊĹĳtŊĹĳtŊĸĳtŊĹĳtŊĹĳtŊĽĵoŊáĈäŊ`éĪŊ–ëĥŊ—ëĥŊ—ìĥŊ—ëĤŊ–ëĤŊ–êģŊ–êģŊ’êģŊ‘çĢŊ‘çġŊ‘æĠŊ”äĝŊ`âĚŊ`àĘŊ_ßĕŊ^ÝĔŊ]ÝēŊ–àćŊĖĚ>ŊĥĠyŊĠĝzŊĝě#Ŋěę#ŊĚė$ŊĘĖ$Ŋĕē%Ŋēđ%ŊđĎ%ŊĎČ&ŊċĈ&Ŋćą"ŊĀĀ"ŊĀÿ"Ŋÿþ"Ŋýý"Ŋþý"Ŋýü"Ŋüú"Ŋúù"Ŋúø"Ŋù÷"Ŋø÷"Ŋöö&ŊäÊ#ŊÃowŊÓ†"ĸãÜ*IîU>5Č¢yÜĭėtŊķĲuŊķĲuŊķĲuŊĸĳuŊķĲuŊķĲuŊĸĳtŊĸĳtŊĸĳtŊĸĳtŊĸĳtŊĺĴsŊĕġ¼Ŋ>æĮŊ—ëĥŊ—ëĤŊ—ëĤŊ–ëĤŊ–êĤŊ–êģŊ–êģŊ’èĢŊ‘çġŊ‘æĠŊ“ãĝŊ`âĚŊ`áĘŊ_àėŊ^ÞĕŊ]ÝēŊ[ÜĒŊ_ÝčŊíą♦ŊĦġvŊğĜ#ŊĝĚ#ŊěĘ#Ŋęė$ŊĘĕ$ŊĕĒ%ŊēĐ%ŊĐĎ%ŊčĊ&ŊĊć&ŊąĄ"Ŋăā"ŊĂā"ŊĀĀ"Ŋÿÿ"Ŋþþ"Ŋþý"Ŋýü"Ŋüû"Ŋûù"Ŋúù"Ŋù÷"Ŋùú"Ŋá♦zŊÉwvŊÕ♣(ąáì?B!øhw‐Ď‡tŊķĴuŊķĲuŊķĲuŊķĲuŊĸĳuŊĸĳuŊĸĳuŊĸĳtŊķĲuŊķĲuŊķĲuŊķĲuŊİį(Ŋ°íĝŊ–ëĦŊ—ëĤŊ–êĤŊ–êģŊ’êģŊ’éģŊ’èĢŊ’çĢŊ‘æĠŊ”äĞŊ“ãěŊ`áęŊ_ßĘŊ^ÞĕŊ^ÝĔŊ]ÝēŊ[ÛđŊ>ÚđŊËóáŊĢĞ$ŊĞě#ŊĜę#ŊěĘ$ŊęĖ$ŊĖĔ%ŊĔĒ%ŊĒĐ%ŊďČ&ŊČĉ&ŊĈĆ&ŊĄă"ŊĄă"ŊĄă"ŊăĂ"ŊĂĀ"ŊĀĀ"Ŋÿþ"Ŋþþ"Ŋþý"Ŋýü"Ŋûú"Ŋûù"Ŋûý"ŊÝ•xŊÐ:yŊÞÐ*É×ëÅ2!ùxynûdqĮČ™oŊĸķuŊĸĴuŊķĲuŊķĲuŊķĲuŊķĲuŊķĲuŊķĲuŊķĲuŊķĳuŊķĲuŊĲİzŊÑĀòŊ”éĨŊ–êĤŊ–êģŊ–éģŊ’èĢŊ’èĢŊ’çĢŊ‘çġŊ”åğŊ“ãĜŊ`âĚŊ_áėŊ_ßĖŊ^ÞĔŊ^ÝēŊ[ÛđŊ[ÛđŊ?ÛđŊ¼åúŊďĕ>ŊĞě#ŊĜę$ŊĚĘ$ŊĘĖ$Ŋĕē%ŊĔđ%ŊđĎ%ŊĎċ&Ŋċĉ&Ŋćą"ŊĆĄ"ŊąĄ"ŊĄă"ŊĄă"ŊăĂ"ŊĂā"ŊāĀ"ŊĀÿ"Ŋÿþ"Ŋþý"Ŋþý"Ŋüû"Ŋýă(ŊÔ@vŊ×…#łðø<:!!ģĸā5úhpĉûYoŊą+pŊĭĕtŊķıuŊķĲuŊķĲuŊķĲuŊķĲuŊĸĳuŊķĲuŊķĲuŊĶĲuŊĶĲvŊûĔÉŊ_èĩŊ–êģŊ’êģŊ’éģŊ’çĢŊ‘çĢŊ‘çĢŊ”åğŊ“ãĜŊ`âĚŊ`áęŊ_ßėŊ^ÞĕŊ^ÝēŊ]ÜđŊ[ÛđŊ[ÛĐŊ[ÚĐŊ.×ēŊûċ½ŊĝĚ#ŊĜę#ŊęĖ$ŊėĔ$ŊĔĒ%ŊĒĐ%Ŋďč&ŊČĊ&ŊĊĈ&ŊĆą"ŊĆą"ŊĆĄ"ŊąĄ"Ŋąă"ŊĄă"ŊăĂ"ŊăĂ"ŊăĂ"ŊĀĀ"Ŋÿÿ"Ŋþþ"Ŋþý"Ŋýý"ŊÒruŊèÐ&Ğáí“S!!!ùux♦úbpňúTqŊĉ”qŊıġuŊĶĲuŊĶĲuŊĶĲuŊĶĲuŊķĲuŊĶĲuŊĶĲuŊĶĲuŊĶĲtŊĖĢ‒Ŋ•îęŊ’éģŊ’èĢŊ’èĢŊ‘çĢŊ‘çġŊ”åĠŊ”äĝŊ`âĚŊ`áęŊ_ßėŊ^ÞĕŊ^ÝĔŊ]ÜĒŊ[ÛđŊ[ÛđŊ[ÛĐŊ[ÚďŊ:ÖĒŊÈðßŊĜĚ$ŊěĘ$ŊęĖ$ŊĖĔ%ŊĔđ%Ŋđď%ŊĎČ&ŊċĈ&ŊĊć&ŊĈĆ&Ŋćą"ŊĆą"ŊĆĄ"ŊĆĄ"ŊąĄ"ŊĄă"ŊĄă"ŊăĂ"ŊĂā"ŊāĀ"ŊĀÿ"Ŋÿā"ŊòÛ#Ŋ×*wŉ÷þ+é!!!!ĉÚ¿DõapŀĕÍrŊįĠuŊĵĲuŊĶĲuŊĶĲuŊĵĲuŊĶĲuŊĶĲuŊĵĲuŊĵĲuŊĶĲuŊĶĲuŊĮĮ"ŊÁøāŊ‘èģŊ‘çĢŊ‘çġŊ”æĠŊ”åğŊ“ãĜŊ“âĚŊ`áęŊ_ßėŊ^ÞĕŊ^ÝĔŊ]ÜĒŊ[ÛđŊ[ÛđŊ[ÚĐŊ[ÚďŊ?ÚďŊ>ØĎŊ;×čŊĕĕ*ŊĚĘ$ŊĘĕ$ŊĖē%ŊēĐ%ŊĐĎ%ŊčĊ&ŊċĈ&ŊĊĈ&ŊĊć&ŊĉĆ&ŊćĆ&ŊĆĆ&ŊĆą"ŊĆą"ŊĆĄ"ŊąĄ"ŊĄă"ŊĄă"ŊĂā"ŊāĀ"ŊăĈ(Ŋá…wŊòá$ňöú‒u!!!!!Ěì)ØĲĬuŊĴįvŊĴįvŊĴİuŊĵıuŊĵıuŊĵĲuŊĵĲuŊĵĲvŊĵıvŊĵĲuŊĵĲuŊļĵoŊáćÞŊ’çĠŊ”æġŊ”åğŊ”äĝŊ“ãĜŊ`âěŊ`áęŊ_ßėŊ^ÞĕŊ^ÝēŊ]ÜēŊ]ÜĒŊ[ÛđŊ[ÛđŊ[ÚďŊ[ÚďŊ?ÙĎŊ?ÙčŊ.ÕĐŊÛøÊŊĞęxŊėĔ$ŊĕĒ%ŊĒď%ŊĎČ%ŊČĉ&ŊċĈ&ŊĊĈ&ŊċĈ&ŊĊĈ&ŊĊć&Ŋĉć&Ŋćą"ŊĆą"ŊĆą"ŊĆĄ"ŊĆĄ"ŊĄă"ŊĄă"ŊăĂ"Ŋÿü&Ŋè€xŊûû;đ!!!!!!ŇŊòCįīzŇĲĭvŊĳĮvŊĳįvŊĴįvŊĴįvŊĴİvŊĴıuŊĴįvŊĴİvŊĵıvŊĵıvŊķĲsŊĔĠ°Ŋ—çěŊ”åĞŊ“äĝŊ“ãěŊ`âĚŊ`áĘŊ_ßĖŊ^ÞĕŊ^ÝĔŊ^ÜēŊ[ÛđŊ[ÚĐŊ[ÚĐŊ[ÛđŊ[ÚďŊ[ÙĎŊ[ÙĎŊ?ØČŊ>ÖĊŊ=×ĆŊěĘ$ŊėĔ#ŊĔđ%ŊđĎ%ŊčĊ&ŊčĊ&Ŋċĉ&Ŋċĉ&ŊċĈ&ŊċĈ&ŊĊĈ&ŊĊĈ&ŊĊć&Ŋĉć&Ŋćą"Ŋćą"ŊĆą"ŊąĄ"Ŋąă"ŊĄĄ"ŊöÜ$Ŋûõ&Ŋüû•o!!!!!!!įī:♥İīxŊıĬwŊĳĮvŊĳĮvŊĳĮvŊĴįvŊĴįvŊĳĮvŊĴįvŊĳįvŊĳįvŊĴİuŊľĵqŊ⅔íĉŊ“ãĝŊ`âěŊ`áĚŊ`àĘŊ_ßĖŊ^ÝĔŊ^ÝĔŊ^ÜēŊ]ÜĒŊ[ÛđŊ[ÚĐŊ[ÚĐŊ[ÚĐŊ[ÚďŊ[ÙĎŊ[ØčŊ?×ČŊ=ÕĉŊ;ÔĊŊÛ÷ÅŊĜĖwŊĒĐ%ŊĐč%Ŋčċ&ŊčĊ&ŊČĊ&ŊČĊ&Ŋċĉ&ŊċĈ&ŊċĈ&ŊĊĈ&ŊĊĈ&ŊĊć&ŊĉĆ"Ŋćą"ŊĆą"ŊĆą"ŊąĄ"ŊĄā"Ŋüñ#Ŋýù=ì!!!!!!!!įī“KĮĪ%ĘİīwŊİĬwŊıĬwŊĲĭvŊĲĭvŊĳĮvŊĲĭvŊĳĮvŊĳĮvŊĳĮvŊĳįvŊĺĳpŊöďÆŊ=ßğŊ`àĘŊ`àėŊ^ÞĖŊ^ÝĔŊ^ÜēŊ]ÜēŊ]ÜđŊ]ÜđŊ]ÛĐŊ[ÚďŊ[ÙďŊ[ÙďŊ[ÙďŊ?ØčŊ[ØČŊ?×ċŊ=ÕĉŊ=ÔĈŊ©ÞóŊďĎ)ŊĒď%ŊĐč%Ŋčċ&Ŋčċ&ŊčĊ&ŊčĊ&ŊČĊ&ŊČĊ&Ŋċĉ&Ŋċĉ&ŊċĈ&ŊĊĈ&ŊĊĈ&Ŋĉć&ŊĈĆ&Ŋćą&ŊĆą"Ŋąă"ŊĂĀ*ĳăă”Z!!!!!!!!!ĬĨ@”ĮĪxŁİīwŊİīwŊİīwŊıĬwŊıĭvŊĲĭvŊĲĭvŊĲĮvŊĳĮvŊĳĮvŊĴįvŊĹĲwŊ[ÞĜŊ_ßėŊ^ÞĕŊ^ÝĔŊ^ÝĔŊ]ÜđŊ]ÛĐŊ]ÛĐŊ]ÛĐŊ[ÛďŊ[ÚďŊ[ÙĎŊ[ÙĎŊ?ØčŊ>×čŊ?×ċŊ[ÖĊŊ=ÕĉŊ=ÔĈŊ?ÕąŊâø»ŊĔĐ#ŊĐč%ŊĎČ%Ŋčċ&Ŋčċ&Ŋčċ&ŊčĊ&ŊČĊ&ŊČĉ&ŊČĉ&ŊċĈ&ŊĊĈ&ŊċĈ&ŊĊĈ&ŊĊć&Ŋćą"Ŋćą"ŊąĄ(ŊăĂ;♦!!!!!!!!!!!ĬĨ(ïĮĩwŊįĪwŊįīwŊİīwŊıĬwŊıĬwŊİĬwŊĲĮvŊĲĭvŊĲĮvŊĲĮvŊĶısŊáăÕŊ<ÛěŊ^ÝĔŊ^ÜēŊ^ÝĒŊ]ÜđŊ]ÛĐŊ]ÛĐŊ[ÛďŊ[ÛďŊ[ÚĎŊ[ÙĎŊ?ØčŊ?×čŊ>×ČŊ?×ċŊ[ÖĊŊ>ÕĉŊ=ÔĈŊ;ÒĉŊµâæŊċċ+ŊĐĎ%ŊĐč%ŊĎč&Ŋčċ&Ŋčċ&Ŋčċ&Ŋčċ&ŊČĊ&ŊČĊ&ŊČĊ&ŊċĈ&ŊċĈ&ŊĊĈ&ŊĊĈ&ŊĉĆ&Ŋćą"ŊĄă*ĊĈċÒ9!!!!!!!!!!!ĪĪØCīĦ"ėĭĩwŊįĪwŊįĩwŊįīwŊİīwŊįĪwŊıīwŊİĬwŊıĬwŊıĬvŊĳĮvŊĞģ]Ŋ^ÝĔŊ^ÜēŊ]ÜĒŊ]ÜđŊ]ÛđŊ]ÛĐŊ[ÛďŊ[ÛĎŊ[ÚčŊ[ÙčŊ[ÚČŊ?ØČŊ?×čŊ>×ČŊ>ÖċŊ?ÖĊŊ>ÕĉŊ=ÔĈŊ<ÓćŊ.ÐćŊíý¾Ŋđď%ŊđĎ%ŊďĎ%ŊďČ&ŊĎČ&Ŋčċ&Ŋčċ&Ŋčċ&Ŋčċ&ŊČĊ&ŊČĊ&ŊċĈ&ŊċĈ&ŊċĈ&ŊĊć%ŊĆą*ĲćĆ®b!!!!!!!!!!!!!Īħ—Rĩĥ&İĬĨwŊĭĩxŊĮĩwŊĮĩwŊĮĪwŊĮĩwŊįĪwŊįĪwŊİīwŊİĬwŊĭĪ$ŊÐøåŊ=ÙĕŊ]ÛđŊ[ÛđŊ]ÚďŊ[ÚĎŊ[ÚĎŊ[ÚĎŊ[ÙČŊ[ÙċŊ[ØċŊ?ØČŊ>×ČŊ>ÖĊŊ>ÖĊŊ>ÖĊŊ>ÕĉŊ<ÔĈŊ=ÓćŊ;ÒĉŊ‘ØöŊĖđzŊđĎ%ŊđĎ%ŊĐč%Ŋďč%ŊĎČ&Ŋčċ&Ŋčċ&Ŋčċ&ŊčĊ&ŊČĊ&ŊČĊ&Ŋċĉ&ŊċĈ&ŊĈĆ)Ŋĉĉ‘p!!!!!!!!!!!!!!!ħĤ^lħĤ%ķĪĦxŊīħxŊĬĨxŊĮĩwŊĮĩwŊĮĩwŊĮĪwŊįĪwŊįĪwŊĲĬuŊĂē†Ŋ”ÞčŊ]ÛđŊ]ÛđŊ[ÚďŊ[ÚĎŊ[ÚčŊ[ÙČŊ[ÙċŊ?ØċŊ?ØċŊ?ØČŊ>×ČŊ>ÖċŊ>ÖċŊ>ÕĉŊ<ÔĈŊ<ÓćŊ=ÓćŊ<ÓĆŊ,ÐĊŊÍîËŊĘĒxŊđĎ%ŊđĎ%ŊđĎ%Ŋďč%ŊďČ&Ŋčċ&Ŋčċ&Ŋčċ&Ŋčċ&ŊČĊ&ŊČĊ&ŊĊć(ŇċĊ`.!!!!!!!!!!!!!!!!!Ģğ..ĥģ$ĴħģyŊĩĥyŊĪĦyŊīħxŊīħxŊĬħxŊĬĨxŊĬĩxŊĮĩwŊīĨ%Ŋ♠ìóŊ]ÛđŊ[ÚĐŊ[ÚĐŊ[ÚĎŊ?ÙčŊ?ÙčŊ[ØċŊ?ØċŊ?×ċŊ>×ČŊ>ÖċŊ>ÖĊŊ>ÖĊŊ=ÕĉŊ=ÔĈŊ=ÔĈŊ=ÓćŊ=ÓćŊ<ÓĆŊ.ÑĈŊöĂ—ŊĔĐzŊđĎ%ŊđĎ%ŊĐč%ŊĐč%Ŋďč&ŊčČ&Ŋčċ&Ŋčċ&Ŋčċ&Ŋċĉ(ŀĊĉ:¾!!!!!!!!!!!!!!!!!!!Ģġ?)ģĠ(ĭĥĢyŊĦģzŊħĤzŊĨĥyŊĩĥyŊĩĥyŊĩĥyŊīĦyŊıĪsŊüďµŊ=ÙēŊ[ÚĐŊ[ÚďŊ[ØĎŊ?ÙĎŊ?ØČŊ>×ČŊ>×ČŊ>×ČŊ>ÖċŊ>ÖċŊ>ÖĊŊ=ÕĉŊ=ÔĈŊ=ÔĈŊ=ÓćŊ=ÓćŊ=ÓćŊ<ÓĆŊ=ÓąŊ°ÜïŊĆĊ;ŊĒď$ŊđĎ%ŊđĎ%ŊĐĎ%ŊĐč%ŊĎč&Ŋčċ&Ŋčċ%ŊČĊ)łċċ?‒!!!!!!!!!!!!!!!!!!!!!ġĞ?WĠĞ*ĐġğzŊĥġzŊĥĢzŊĥĢzŊĦĢyŊĦĢyŊħģyŊħģyŊĮĨtŊ«êòŊ>ÙđŊ?ÙĎŊ?ØčŊ>×ČŊ>×ČŊ>×ČŊ>ÖĊŊ>ÖċŊ>ÖċŊ>ÖĊŊ=ÕĉŊ=ÕĉŊ=ÔĈŊ=ÔĈŊ=ÓćŊ<ÓćŊ<ÓĆŊ<ÒąŊ<ÒąŊ;ÑĆŊ¿æÚŊĒĐ"Ŋđď%ŊđĎ%ŊđĎ%ŊĐĎ%ŊĐč%ŊĎČ%Ŋčċ+ĭĎČ>n!!!!!!!!!!!!!!!!!!!!!!!ġĠ€BĜę+ðĝĜ$ŇĠĜ#ŊġĞzŊĢğzŊģğzŊĤĠzŊģğzŊĤğyŊęĚ<Ŋ,ÕēŊ>ØčŊ>×ČŊ>×ČŊ>ÖċŊ>ÖĊŊ=ÕĊŊ>ÕĊŊ>ÖĊŊ=ÕĉŊ=ÕĉŊ=ÕĉŊ<ÔĈŊ<ÔćŊ=ÓĆŊ<ÓĆŊ<ÒĆŊ<ÒąŊ;ÑĄŊ;ÑĄŊ@ÎĉŊÅéÑŊēĐ%ŊĒĎ%ŊđĎ%ŊĐĎ%ŊĐč&ŉĎČ,ČĐď—N!!!!!!!!!!!!!!!!!!!!!!!!!!Ěė<‡ĚĘ&ĦěĘ$ŊĜĚ#ŊĝĚ#ŊĞě#ŊĞě#ŊĞě#ŊğĜyŊàüÆŊ.ÕďŊ>ÖċŊ>ÖĊŊ=ÕĊŊ=ÕĊŊ>ÕĉŊ>ÕĉŊ=ÕĉŊ=ÕĉŊ=ÔĈŊ=ÔĈŊ<ÔćŊ<ÓćŊ=ÓĆŊ<ÓĆŊ<ÒąŊ;ÑĄŊ;ÑĄŊ;ÑĄŊ;ÑăŊ)ËĉŊ‡ßâŊ÷ā–ŊāĆ>ŊčČ(ĮĎč:Ð!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ěĘ…WĘĖ+ÏĘĕ(ļĘė$Ŋęė$Ŋęė$Ŋęė$ŊĚė$ŊĔĔ@Ŋ£æêŊ;ÔČŊ=ÔĈŊ=ÔĈŊ=ÔĈŊ=ÔĈŊ=ÕĉŊ=ÔĈŊ=ÔĈŊ<ÔĈŊ=ÓćŊ=ÓćŊ=ÓĆŊ=ÓĆŊ<ÒĄŊ;ÑĄŊ;ÑĄŊ;ÑĄŊ;ÑĄŊ;ÑĄŊ<ÏāŊ.ÍĄŊ=ÌúŅÁàÓÝûĀ…k!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ĞĜ€3ĝĚ’Ręė:Ùėĕ"Ŋėĕ#ŊĘĕ$ŊĘĖ$Ŋęė#ŊăČ`Ŋ`ØÿŊ<ÔĈŊ=ÔĈŊ<ÓćŊ=ÔĈŊ<ÔĈŊ=ÔĈŊ=ÔĈŊ<ÓćŊ<ÓćŊ<ÓĆŊ<ÑĄŊ;ÑĄŊ;ÑĄŊ;ÑĄŊ;ÑĄŊ;ÑĄŊ;ÑĄŊ;ÒąŊ.ËýŊ:Ä÷é`ËücX°Ģ4!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ĮīÞ9ęė<ÎĖĔ&İĘĕ$łĘĕ$ňĜėxŊõĄ°Ŋ=ÕąŊ;ÔĈŊ<ÔĈŊ=ÔćŊ<ÔćŊ<ÓćŊ<ÓĆŊ<ÒąŊ<ÒąŊ<ÒĄŊ;ÑĄŊ;ÐăŊ;ÐăŊ;ÐăŊ;Ðăŉ<ÒąŃ:ÌĀĴ<ÇùÜ♠ÔöJ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ĘĘ=@ęė+Øėĕ)ĆĠęxĠøą®Ļ®ÜòŊ>ÒĂŊ;ÑąŊ;ÑąŊ<ÒĄŊ<ÒąŊ;ÑĄŊ.ÐăŊ.ÏăŊ;ÏāŊ;ÌĀĻ;ÎĀģ;ÌÿĊ<ÉûÞ=Äõ<ŊÀ.2!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ļĸ÷5ĕĖ]Xģĝ&#óĂ€[–Øû•]ÎāÅ“ÒăÝ?Òąæ>Ñąç_Ñăß^ÍýÊ[Ñă¼=Ìü]<Åù#?ÁñaÌÅí7!!!!!!!!!!!!!!!!!!!!!!!!*/}};

var createSprite = function(data, n) {
    var graphics = createGraphics(data.width, data.height, JAVA2D);
    var s = data.f.toString();
    var imgData = s.substring(15, s.length - 4);
    
    if (graphics) {
        graphics.background(0, 0, 0, 0);
        var img = graphics.get();
        var cxt = img.sourceImg.getContext("2d");
        var pixels = cxt.getImageData(0, 0, graphics.width, graphics.height);
        
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%&"()@*+,./:;<=>?[]^_`“”‘’–—…‐‒°©®™•½¼¾⅓⅔†‡µ¢£€«»♠♣♥♦¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌō';
        var l = imgData.length;
        var x = 0;
        var i = 0;
        var char;
        
        for (i = 0; i < l;) {
            char = imgData.charAt(i++);
            if (char === '!') {
                // Transparent, so skip
                x += 4;
            } else {
                pixels.data[x++] = chars.indexOf(char);
            }
        }
        
        cxt.putImageData(pixels, 0, 0);
        graphics.image(img, 0, 0);
        sprites[n] = graphics;
        spritesLoaded++;
    }
};

/*********************************************
 *      Slider object
**********************************************/
{
var Slider = function(x, y, length, orientation, minValue, maxValue, nowValue, name, updateF) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.orientation = orientation;
    
    if (this.orientation === 'vertical') {
        this.start = y;
        this.end = y + this.length;
        this.v1 = this.end;
        this.v2 = this.start;
    } else {
        this.start = x;
        this.end = x + this.length;
        this.v1 = this.start;
        this.v2 = this.end;
    }
    
    this.name = name;
    this.updateFunction = updateF;
    
    this.ballR = 8;
    this.ballD = this.ballR * 2;
    
    this.min = minValue;
    this.max = maxValue;
    this.value = nowValue || minValue;
    this.setValue(this.value);

    this.held = false;
};

Slider.prototype.draw = function() {
    strokeWeight(3);
    stroke(GREY);
    if (this.orientation === 'vertical') {
        line(this.x, this.y, this.x, this.end);
    } else {
        line(this.x, this.y, this.end, this.y);
    }
    
    strokeWeight(1);
    stroke(BACKGROUND);
    fill(ORANGE);
    if (this.orientation === 'vertical') {
        ellipse(this.x, this.ball, this.ballD, this.ballD);
    } else {
        ellipse(this.ball, this.y, this.ballD, this.ballD);
    }
    
};

Slider.prototype.mouseOver = function() {
    if (mouseX >= this.x - this.ballR &&
        mouseY >= this.y - this.ballR) {
        if (this.orientation === 'vertical') {
            return mouseX <= this.x + this.ballR &&
                   mouseY <= this.end + this.ballR;
        } else {
            return mouseX <= this.end + this.ballR &&
                   mouseY <= this.y + this.ballR;
        }   
    }
};
    
Slider.prototype.selected = function() {
    if (this.orientation === 'vertical') {
        this.held = dist(mouseX, mouseY, this.x, this.ball) <= this.ballR;
    } else {
        this.held = dist(mouseX, mouseY, this.ball, this.y) <= this.ballR;
    }
    if (!this.held && this.mouseOver()) {
        this.setBallPosition();
    }
};
    
Slider.prototype.mouseDragged = function() {
    if (this.held) {
        this.setBallPosition();
        return true;
    }
};

Slider.prototype.setBallPosition = function() {
    var value = this.orientation === 'vertical' ? mouseY : mouseX;
    this.ball = constrain(value, this.start, this.end);
    this.setValue();
};

Slider.prototype.setValue = function(d) {
    if (d !== undefined) {
        this.value = constrain(d, this.min, this.max);
    } else {
        
        this.value = round(map(this.ball, this.v1, this.v2, this.min, this.max));
        this.update();
    }
    this.ball = map(this.value, this.min, this.max, this.v1,  this.v2);
};

Slider.prototype.update = function() {
    if (this.updateFunction) {
        this.updateFunction(this.value);
    }
};
}
/***********************************************
 *  GUI Button
************************************************/
{
var Button = function(x, y, w, h, name, clickFunction) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
    this.defaultColor = color(140, 140, 140);
    this.highlightColor = color(40, 40, 40);
    this.showing = true;
    this.box = this.h - 6;
    this.clickFunction = clickFunction;
};

Button.prototype.mouseOver = function() {
    return (mouseX >= this.x && mouseX <= this.x + this.w &&
            mouseY >= this.y && mouseY <= this.y + this.h);
};

Button.prototype.click = function() {
    if (this.clickFunction) {
        this.clickFunction();
    }
};

Button.prototype.mouseReleased = function() {
    if (this.mouseOver()) {
        this.click();
    }
};

Button.prototype.draw = function() {
    if (!this.showing) { return; }
    
    noFill();
    strokeWeight(1);
    stroke(this.defaultColor);
    if (!this.deactivated && (this.mouseOver() || this.selected)) {
        fill(TOOLBAR);
        stroke(this.highlightColor);
    }
    
    rect(this.x, this.y - 1, this.w, this.h + 3, 8);
    
    if (this.deactivated) {
        fill(120);
    } else {
        fill(TEXTCOL);
    }
    
    textFont(sansFont, 13);
    textAlign(CENTER, CENTER);
    text(this.name, this.x + this.w / 2, this.y + this.h/2);
};

// Circular button
var CircleButton = function(x, y, w, h, clickFunction, drawFunction) {
    Button.call(this, x, y, w, h, "", clickFunction);
    this.drawIcon = drawFunction;
};
CircleButton.prototype = Object.create(Button.prototype);

CircleButton.prototype.draw = function() {
    var c;
    if (this.mouseOver()) {
        c = color(40, 40, 40);
        fill(TOOLBAR);
    } else {
        c = color(140, 140, 140);
        noFill();
    }
    
    var x = this.x + this.w / 2;
    var y = this.y + this.w / 2;
    stroke(c);
    strokeWeight(2);
    ellipse(x, y, this.w, this.w);
    
    if (this.drawIcon) {
        fill(c);
        this.drawIcon(x, y, this.w / 2);   
    }
};
}
/***********************************************
 *      Draggable point
************************************************/
{
var DraggablePoint = function(x, y, color) {
    this.x = x;
    this.y = y;
    this.r = 7;
    this.color = color || ORANGE;
    this.animation = 0;
    this.selected = false;
};

DraggablePoint.prototype.mouseOver = function() {
    return dist(mouseX, mouseY, this.x, this.y) <= this.r;
};

DraggablePoint.prototype.move = function() {
    this.x += mouseX - pmouseX;
    this.y += mouseY - pmouseY;
};

DraggablePoint.prototype.onMove = function() {
    // To be overwritten
};

DraggablePoint.prototype.draw = function() {
    if (this.selected || (!this.selected && this.mouseOver())) {
        if (this.animation < 5) {
            this.animation++;
        }
    } else {
        this.animation = 0;
    }

    stroke(BACKGROUND);
    strokeWeight(1);
    fill(this.color);
    
    var r = this.r * 2 + this.animation;
    ellipse(this.x, this.y, r, r);
    
    if (this.selected) {
        noFill();
        stroke(BACKGROUND);
        ellipse(this.x, this.y, r - 4, r - 4);
    }
};

var ConstrainedPoint = function(x, y, rangeX, rangeY, color) {
    DraggablePoint.call(this, x, y, color);
    this.minX = rangeX[0];
    this.maxX = rangeX[1];
    this.minY = rangeY[0];
    this.maxY = rangeY[1];
};
ConstrainedPoint.prototype = Object.create(DraggablePoint.prototype);

ConstrainedPoint.prototype.move = function() {
    this.x = constrain(this.x + mouseX - pmouseX, this.minX, this.maxX);
    this.y = constrain(this.y + mouseY - pmouseY, this.minY, this.maxY);
};

ConstrainedPoint.prototype.moveBy = function(dx, dy) {
    this.x = constrain(this.x + dx, this.minX, this.maxX);
    this.y = constrain(this.y + dy, this.minY, this.maxY);
};
}
/***********************************************
 *      KeyFrame
 * A point representing the value of an avar
 * at a given keyframe.
 * It can be moved vertically to change the value.
************************************************/

var KeyFrame = function(frame, value, avar, fixed) {
    this.frame = frame;
    this.value = value;
    this.avar = avar;
    this.fixed = fixed;
    this.color = ORANGE;
    this.animation = 0;
    this.r = 7;
    this.frameSelector = this.avar.timeline.frameSelector;
    
    this.handles = [];
    this.setPosition();
};

KeyFrame.prototype = Object.create(DraggablePoint.prototype);

KeyFrame.prototype.setPosition = function() {
    var oldX = this.x;
    var oldY = this.y;
    this.x = this.avar.frameToXPosition(this.frame);
    this.y = this.avar.valueToYPosition(this.value);
    var dx = this.x - oldX;
    var dy = this.y - oldY;
    
    // Update handle positions
    for (var i = 0; i < this.handles.length; i++) {
        this.handles[i].moveBy(dx, dy);
    }
};

KeyFrame.prototype.mouseOver = function() {
    return dist(mouseX, mouseY, this.x, this.y) <= this.r + 1;
};

KeyFrame.prototype.move = function() {
    this.y = constrain(this.y + mouseY - pmouseY, this.avar.y4, this.avar.y3);
    this.value = this.avar.yPositionToValue(this.y);
    
    var mouseFrame = this.frameSelector.mapMouseToFrame();
    if (!this.fixed && this.frame !== mouseFrame) {
        this.frame = mouseFrame;
        this.avar.updateValues();
        this.setPosition();
    }
    
};

KeyFrame.prototype.drawWithHandles = function() {
    for (var i = 0; i < this.handles.length; i++) {
        var handle = this.handles[i];
        
        strokeWeight(2);
        stroke(handle.color + (100 << 24));
        line(handle.x, handle.y, this.x, this.y);
        handle.draw();
    }
    this.draw();
};

KeyFrame.prototype.addHandle = function(kf2) {
    var dx = this.x - kf2.x;
    var d = abs(dx) * 0.2;
    var angle = atan2(this.y - kf2.y, dx);
    var avar = this.avar;
    
    this.handles.push(new ConstrainedPoint(
        this.x - d * cos(angle),
        this.y - d * sin(angle),
        [avar.x + avar.padBig, avar.x + avar.w],
        [avar.y2 + avar.padBig, avar.y1 - avar.padBig],
        PINK)
    );
};

/***********************************************
 *      Frame selector
 * A slider allowing the user to select a frame
************************************************/
{
var FrameSelector = function(timeline, x, y, dx, maxFrames) {
    this.timeline = timeline;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.w = (maxFrames + 1) * this.dx;
    
    this.r = 9;
    this.by = this.y - this.r;
    this.maxFrames = maxFrames;
    this.held = false;
    
    this.setBallPosition();
    this.mouseOverFrame = -1;
};

FrameSelector.prototype.draw = function() {
    this.setBallPosition();
    
    this.mouseOverFrame = this.mapMouseToFrame();
    if (this.mouseOver() &&
        this.mouseOverFrame !== this.timeline.currentFrame) {
            strokeWeight(2);
            stroke(ORANGE);
            noFill();
            var x = this.x + (this.mouseOverFrame + 0.5) * this.dx;
            ellipse(x, this.by, this.r * 2, this.r * 2);
    }
    
    // Frame counter
    strokeWeight(1);
    stroke(GREY);
    fill(TEXTCOL);
    textSize(11);
    textAlign(CENTER, BASELINE);
    for (var i = 0; i <= this.maxFrames; i++) {
        var x = this.x + (i + 0.5) * this.dx;
        line(x, this.y, x, this.y - 3);
        text(i + 1, x, this.y - 5);
    }
    
    // Line over the avar boxes
    strokeWeight(1);
    stroke(200);
    line(this.bx, this.y, this.bx, this.y + this.timeline.h);
    
    // Selector ball
    fill(ORANGE);
    stroke(BACKGROUND);
    ellipse(this.bx, this.by, this.r * 2 + 1, this.r * 2 + 1);
    
    fill(TEXTCOL);
    textSize(11);
    textAlign(CENTER, CENTER);
    text(this.timeline.currentFrame + 1, this.bx, this.by);
    
    strokeWeight(1);
    stroke(GREY);
    line(this.x - 36, this.y, this.x + this.w, this.y);
};

FrameSelector.prototype.setBallPosition = function() {
    this.bx = this.x + (this.timeline.currentFrame + 0.5) * this.dx;
};

FrameSelector.prototype.selected = function() {
    this.held = dist(mouseX, mouseY, this.bx, this.by) <= this.r;
};

FrameSelector.prototype.mouseDragged = function() {
    if (this.held) {
        this.updateFrame();
        return true;
    }
};

FrameSelector.prototype.mouseOver = function() {
    return mouseX > this.x && mouseX < this.x + this.w &&
           mouseY < this.y && mouseY > this.y - 2 * this.r;
};

FrameSelector.prototype.mouseReleased = function() {
    // Clicking on frame moves to that frame
    if (this.mouseOver()) {
        this.updateFrame();
    }
    this.held = false;
};

FrameSelector.prototype.mapMouseToFrame = function() {
    var f = map(mouseX + 2, this.x, this.x + this.w, 0, this.maxFrames + 1);
    return constrain(floor(f), 0, this.maxFrames);
};

FrameSelector.prototype.updateFrame = function() {
    // Move to a new frame based on the mouse position
    this.timeline.currentFrame = this.mapMouseToFrame();
    this.setBallPosition();
};
}
/**********************************************
 *      Avar
 * An animation variable.
 * Each variable has a value for each frame.
 * Values are determined by keyframes and
 * interpolation between these frames.
***********************************************/

var Avar = function(timeline, name, value, vmin, vmax) {
    this.timeline = timeline;
    this.name = name;
    this.min = vmin;
    this.max = vmax;
    
    this.frameCount = timeline.frameCount;
    this.keyFrames = [];
    this.controlPoints = [];
    
    this.x = timeline.x;
    this.y = timeline.y;
    this.w = timeline.w;
    this.h = timeline.h;
    
    this.dx = this.w / this.frameCount;
    this.y1 = this.y + this.h;
    this.y2 = this.y;

    this.padSmall = 4;
    this.padBig = 10;
    this.border = 70;
    this.y3 = this.y + this.h - this.border;
    this.y4 = this.y + this.border;
    
    this.selected = -1;
    this.dragging = false;
    
    this.addKeyFrame(0, value, true);
    this.addKeyFrame(this.frameCount - 1, value, true);
    
    // Update control points
    for (var i = 0; i < this.keyFrames.length; i++) {
        this.keyFrames[i].setPosition();
    }
    this.updateValues();
};

Avar.prototype.drawSmall = function(y, h) {
    var y2 = y + h;
    var mouseOver = mouseX >= this.x - 36 &&
                    mouseX <= this.x + this.w &&
                    mouseY > y &&
                    mouseY <= y2;

    this.drawLabel(y, h, mouseOver);
    y += this.padSmall;
    y2 -= this.padSmall;
    
    // Interpolated line
    strokeWeight(2);
    this.drawLine(y2, y);
    
    // Keyframe markers
    strokeWeight(1);
    stroke(BACKGROUND);
    fill(BLUE);

    for (var i = 0; i < this.keyFrames.length; i++) {
        var kf = this.keyFrames[i];
        var ky = map(kf.value, this.min, this.max, y2, y);
        ellipse(kf.x, ky, 7, 7);
    }
};

Avar.prototype.drawBig = function() {
    this.drawLabel(this.y, this.h);
    
    // Draw borders
    stroke(200);
    strokeWeight(1);
    line(this.x, this.y3, this.x + this.w, this.y3);
    line(this.x, this.y4, this.x + this.w, this.y4);
    
    // Interpolated line
    strokeWeight(3);
    this.drawLine(this.y3, this.y4);
    
    for (var i = 0; i < this.keyFrames.length; i++) {
        this.keyFrames[i].drawWithHandles();
    }
    
    // Mouse over keyframe
    var frame = this.frameHighlight();
    
    // TODO: also not mouseover control point
    if (frame !== undefined && !this.dragging) {
        // Indicate possible keyFrame
        if (!this.isKeyFrame(frame[0])) {
            strokeWeight(2);
            stroke(ORANGE);
            fill(BACKGROUND);
            ellipse(frame[1], frame[2], 13, 13);   
        }
        
        // Indicate this frame
        var fs = this.timeline.frameSelector;
        noFill();
        ellipse(frame[1], fs.by, fs.r * 2 + 1, fs.r * 2 + 1);
    }
};

Avar.prototype.drawLabel = function(y, h, highlight) {
    var x = this.x;
    var y2 = y + h/2;
    var frame = this.timeline.currentFrame;
    
    // Lower border line
    strokeWeight(1);
    stroke(GREY);
    noFill();
    line(x - 36, y + h, x + this.w, y + h);
    
    // Label
    noStroke();
    fill(highlight ? 200 : 230);
    rect(x - 35, y + 1, 35, h - 1);
    
    textAlign(CENTER, BASELINE);
    textFont(serifFont, 20);
    fill(TEXTCOL);
    text(this.name, x - 18, y2 - 4);
    
    textAlign(CENTER, TOP);
    textFont(sansFont, 12);
    text(round(this.values[frame]), x - 18, y2 + 1);
};

Avar.prototype.drawLine = function(y1, y2) {
    var x = this.keyFrames[0].x;
    var dx = (this.keyFrames[this.keyFrames.length - 1].x - x) / (this.lines.length - 1);
    
    stroke(BLUE);
    noFill();    
    beginShape();
    var vy = map(this.lines[0], this.min, this.max, y1, y2);
    curveVertex(x, vy);
    for (var i = 0; i < this.lines.length; i++) {
        var vy = map(this.lines[i], this.min, this.max, y1, y2);
        curveVertex(x + i * dx, vy);
    }
    curveVertex(x + i * dx, vy);
    endShape();
};

Avar.prototype.addKeyFrame = function(frame, value, fixed) {
    var kf = new KeyFrame(frame, value, this, fixed);
    this.keyFrames.push(kf);
    
    this.keyFrames.sort(function(a, b) {
        return a.frame - b.frame;
    });
    
    // Find index after sorting
    var index = this.keyFrames.indexOf(kf);
    
    if (index === 0) {
        // First point, so we need to add a fake second point
        kf.addHandle({ x: this.x + this.w, y: kf.y });
    } else {
        kf.addHandle(this.keyFrames[index - 1]);
    }
    if (index < this.keyFrames.length - 1) {
        kf.addHandle(this.keyFrames[index + 1]);
    }
};

Avar.prototype.addControlPoints = function(index) {
    // No need to add for very first keyframe
    // before other points added.
    if (index === 0) { return; }
    
    // Add control points before and after index
    var p1 = this.keyFrames[index - 1];
    var p2 = this.keyFrames[index];
    var p3 = this.keyFrames[index + 1];
    
    var xRange = [this.x + this.padBig, this.x + this.w];
    var yRange = [this.y2 + this.padBig, this.y1 - this.padBig];
    
    var getPoint = function(p1, p2, p3) {
        p3 = p3 || p2;
        var d = dist(p1.x, p1.y, p3.x, p3.y);
        var dx = (p3.x - p1.x) / d;
        var dy = (p3.y - p1.y) / d;
        var d2 = min(d, 0.2 * dist(p1.x, p1.y, p2.x, p2.y));
        
        return new ConstrainedPoint(
            p1.x + dx * d2,
            p1.y + dy * d2,
            xRange, yRange, PINK);
    };
    
    // Convert index of keyframe to
    // index of control point
    index = index * 2 - 1;
    
    if (!p3) {
        // Final keyframe
        var cp1 = getPoint(p1, p2);
        var cp2 = getPoint(p2, p1);
        this.controlPoints.splice(index, 0, cp1, cp2);
    } else {
        var cp1 = getPoint(p2, p1);
        var cp2 = getPoint(p2, p3);
        this.controlPoints.splice(index, 0, cp1, cp2);
        // Shrink arm of existing control point
        var cp1a = getPoint(p1, p2, this.controlPoints[index - 1]);
        this.controlPoints.splice(index - 1, 1, cp1a);
    }
};

Avar.prototype.removeSelectedKeyFrame = function() {
    // Check it's not the first or last frame
    if (this.selected > 0 && this.selected < this.keyFrames.length - 1) {
        this.keyFrames.splice(this.selected, 1);
        this.controlPoints.splice(this.selected, 2);
        this.updateValues();
    }
};

Avar.prototype.updateValues = function() {
    this.lines = [];
    this.values = [];
    var n = this.keyFrames.length - 1;

    for (var i = 0; i < n; i++) {
        var p1 = this.keyFrames[i];
        var p2 = this.keyFrames[i + 1];
        var m1 = p1.handles[p1.handles.length - 1];
        var m2 = p2.handles[0];
        var df = p2.frame - p1.frame;

        for (var j = p1.frame; j < p2.frame; j += 0.25) {
            var t = (j - p1.frame) / df;
            var p = cubicSpline(p1, p2, m1, m2, t);
            var v = this.yPositionToValue(p.y);

            this.lines.push(v);
            if (round(j) === j) {
                this.values.push(v);
            }
        }
    }

    this.values.push(this.keyFrames[n].value);
};

Avar.prototype.valueToYPosition = function(v) {
    return map(v, this.min, this.max, this.y3, this.y4);
};

Avar.prototype.yPositionToValue = function(y) {
    return map(y, this.y3, this.y4, this.min, this.max);
};

Avar.prototype.xPositionToFrame = function(x) {
    var fs = this.timeline.frameSelector;
    return map(x, fs.x, fs.x + fs.w, 1, fs.maxFrames + 1);
};

Avar.prototype.frameToXPosition = function(f) {
    var fs = this.timeline.frameSelector;
    return fs.x + (f + 0.5) * fs.dx;
};

Avar.prototype.isKeyFrame = function(frame) {
    for (var i = 0; i < this.keyFrames.length; i++) {
        if (this.keyFrames[i].frame === frame) {
            return true;
        }
    }
};

Avar.prototype.frameHighlight = function() {
    // Show add keyframe marker
    var fs = this.timeline.frameSelector;
    var frame = fs.mouseOverFrame;
    
    if (frame > -1) {
        var vx = this.x + (frame + 0.5) * this.dx;
        var vy = this.valueToYPosition(this.values[frame]);
        
        if (dist(mouseX, mouseY, vx, vy) <= 10) {
            return [frame, vx, vy];
        }
    }
};

Avar.prototype.selectedNotEndFrame = function() {
    var s = this.selected;
    if (s > 0 && s < this.keyFrames.length) {
        return this.keyFrames[s].frame < this.frameCount - 1;
    }
};

Avar.prototype.mouseOver = function() {
    return mouseY >= this.y && mouseY <= this.y + this.h - 1 && 
           mouseX >= this.x - 36 && mouseX <= this.x + this.w;
};

Avar.prototype.mousePressed = function() {
    // Deselect whatever is currently selected
    if (this.selected > -1) {
        this.keyFrames[this.selected].selected = false;
        this.selected = -1;
    }
    
    // Select key frame node
    if (this.mouseOver()) {
        for (var i = 0; i < this.keyFrames.length; i++) {
            var kf = this.keyFrames[i];
            if (kf.mouseOver()) {
                this.selected = i;
                this.dragging = kf;
                kf.selected = true;
                this.timeline.currentFrame = kf.frame;
                
                // Show remove button if
                // a non-end frame is selected
                if (this.selectedNotEndFrame()) {
                    removeButton.showing = true;
                }
                return;
            }
            
            // Select a keyframe handle
            for (var j = 0; j < kf.handles.length; j++) {
                if (kf.handles[j].mouseOver()) {
                    this.dragging = kf.handles[j];
                    return;
                }
            }
        }
    }
};

Avar.prototype.mouseDragged = function() {
    if (this.dragging) {
        this.dragging.move();
        this.updateValues();
    }
};

Avar.prototype.mouseOverAvars = function() {
    if (this.mouseOver()) {
        var fs = this.timeline.frameSelector;
        var frame = fs.mouseOverFrame;
        
        if (frame > -1) {
            var vx = this.x + (frame + 0.5) * this.dx;
            var vy = this.valueToYPosition(this.values[frame]);
            
            if (dist(mouseX, mouseY, vx, vy) <= 10) {
                return [frame, vx, vy];
            }
        }
    }
};

Avar.prototype.mouseReleased = function() {
    var frame = this.mouseOverAvars();
    
    if (frame && !this.isKeyFrame(frame[0]) && !this.dragging) {
        this.addKeyFrame(frame[0], this.values[frame[0]]);
        this.timeline.currentFrame = frame[0];
        this.updateValues();
    }
    this.dragging = false;
};

/***********************************************
 *      Timeline
 * A object that contains an array for each avar
************************************************/
{
var Timeline = function(x, y, w, h, frames, scene) {
    this.x = x + 36;
    this.y = y;
    this.w = w - 36;
    this.h = h;
    this.dx = this.w / frames;
    this.scene = scene;
    this.state = 'paused';
    
    this.frameCount = frames;
    this.currentFrame = 0;
    this.frameSelector = new FrameSelector(
        this, this.x, this.y, this.dx, this.frameCount -1
    );
    
    this.avars = [];
    this.selectedAvar = false;
    this.keyFrames = [0, this.frameCount - 1];
    
    var minimise = this.deselectAvar.bind(this);
    var minimiseIcon = function(x, y, r) {
        noStroke();
        rect(x - 5, y - 2, 10, 4, 5);
    };
    this.minimiseButton = new CircleButton(
        this.x - 26, this.y + 8,
        16, 16, minimise, minimiseIcon);
};

Timeline.prototype.draw = function() {
    // Move to next frame if running
    var mod = 1 << (6 - speedSlider.value);
    if (this.state === 'running' && frameCount % mod === 0) {
        this.currentFrame++;
        this.currentFrame %= this.frameCount;
    }

    var n = this.avars.length;
    var dy = floor(this.h / n);

    // Draw avar background
    if (!this.selectedAvar &&
        mouseX >= this.x - 36 && mouseX <= this.x + this.w) {
            
        var y = this.y;
        for (var a = 0; a < n; a++) {
            var avar = this.avars[a];
            if (mouseY > y && mouseY <= y + dy) {
                fill(240);
                noStroke();
                rect(avar.x, y + 1, this.w, dy);
            }
            y += dy;
        }
    }
    
    // Frame Selector
    this.frameSelector.draw();
    
    // Draw avars
    if (this.selectedAvar) {
        this.selectedAvar.drawBig();
        this.minimiseButton.draw();
    } else {
        for (var a = 0; a < n; a++) {
            this.avars[a].drawSmall(this.y + a * dy, dy);
        }
    }
};

Timeline.prototype.removeSelectedKeyFrame = function() {
    for (var a = 0; a < this.avars.length; a++) {
        if (this.avars[a].selected > -1) {
            this.avars[a].removeSelectedKeyFrame();
            removeButton.showing = false;
        }
    }
};

Timeline.prototype.selectAvar = function(avar) {
    this.selectedAvar = this.avars[avar];
};

Timeline.prototype.deselectAvar = function() {
    this.selectedAvar = false;
};

Timeline.prototype.mouseOver = function() {
    return mouseX >= this.x && mouseX <= this.x + this.w &&
           mouseY >= this.y && mouseY <= this.y + this.h;
};

Timeline.prototype.mouseDragged = function() {
    // Drag sliders and update values
    if (this.state === 'paused') {
        this.frameSelector.mouseDragged();
        
        for (var a = 0; a < this.avars.length; a++) {
            this.avars[a].mouseDragged();
        }
    }
};

Timeline.prototype.mousePressed = function() {
    if (this.state === 'paused') {
        this.frameSelector.selected();
        
        if (!this.mouseOver()) { return; }
        
        // Check whether any
        // keyframes are selected
        var anySelected = false;
        if (this.selectedAvar) {
            this.selectedAvar.mousePressed();
            if (this.selectedAvar.selected > -1) {
                anySelected = true;
            }
        } else {
            for (var a in this.avars) {
                this.avars[a].mousePressed();
                
                if (this.avars[a].selected > -1) {
                    anySelected = true;
                    break;
                }
            }
        }
        
        if (!anySelected) {
            removeButton.showing = false;
        }
    }
};

Timeline.prototype.mouseReleased = function() {
    if (this.state !== 'paused') {
        return;
    }
    
    this.frameSelector.mouseReleased();
    
    if (!this.selectedAvar) {
        var y = this.y;
        var dy = floor(this.h / this.avars.length);
        
        for (var a = 0; a < this.avars.length; a++) {
            if (mouseY > y && mouseY < y + dy) {
                this.selectAvar(a);
                break;
            }
            y += dy;
        }
    } else {
        this.selectedAvar.mouseReleased();
        this.minimiseButton.mouseReleased();
    }
};
}
/***********************************************
 *      Actor
 * An actor is an animated object
 * (here a ball) in the scene.
************************************************/
{
var Actor = function(timeline) {
    this.timeline = timeline;
    this.avars = {};
};

Actor.prototype.draw = function(dx, dy) {
    if (!spritesLoaded) {
        createSprite(ballSprite, 0);
        return;
    }
    
    var f = this.timeline.currentFrame;
    var x = dx + this.avars.x.values[f];
    var y = dy - this.avars.y.values[f];
    var sx = max(0, this.avars.sx.values[f]);
    var sy = max(0, this.avars.sy.values[f]);
    var a = this.avars.a.values[f];
    
    // Shadow
    pushMatrix();
        translate(x + 1, y - sy / 2 + 1);
        rotate(a);
        scale(sx / 64, sy / 64);
        noStroke();
        fill(0, 0, 0, 60);
        ellipse(0, 0, 60, 60);
    popMatrix();
    
    // Ball
    pushMatrix();
    translate(x, y - sy / 2);
    rotate(a);
    scale(sx / 64, sy / 64);
    image(sprites[0], -32, -32, 64, 64);
    popMatrix();
};

Actor.prototype.addAvar = function(name, value, vmin, vmax) {
    this.timeline.avars.push(
        new Avar(this.timeline, name, value, vmin, vmax)
    );
    this.avars[name] = this.timeline.avars.slice(-1)[0];
};
}
/************************************************
 *      Scene
 * A scene is box in which the actor exists.
 * It contains the background, here some grass.
************************************************/
{
var Scene = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.actors = [];
};

Scene.prototype.draw = function() {
    fill(SKYBLUE);
    rect(this.x, this.y, this.w, this.h + 20);
    
    /*
    strokeWeight(1);
    for (var y = 0; y < this.h + 20; y++) {
        stroke(lerpColor(SKYBLUE2, SKYBLUE, y / (this.h + 20)));
        line(this.x, this.y + y, this.x + this.w, this.y + y);
    }
    */
    
    noStroke();
    fill(120, 200, 160);
    rect(this.x + 1, this.y + this.h, this.w - 1, 20);
    
    strokeWeight(2);
    stroke(GREEN);
    line(this.x + 1, this.y + this.h + 1, this.x + this.w - 1, this.y + this.h + 1);
    
    for (var i = 0; i < this.actors.length; i++) {
        this.actors[i].draw(this.x, this.y + this.h);
    }
    
    // Border
    strokeWeight(1);
    stroke(GREY);
    noFill();
    rect(this.x, this.y, this.w, this.h + 20);
    
    // Clip scene
    noStroke();
    fill(BACKGROUND);
    rect(0, 0, width, this.y);
    rect(0, 0, this.x, this.y + this.h + 60);
    rect(this.x + this.w + 1, 0, this.x, this.y + this.h + 60);
    rect(0, this.y + this.h + 21, width, 40);
};

Scene.prototype.addActor = function(actor) {
    this.actors.push(actor);
};
}
/***********************************************
 *      Setup
************************************************/

var scene = new Scene(20, 10, width - 40, 200);

// Create 24 frames of animation
var timeline = new Timeline(
    20, scene.y + scene.h + 48,
    width - 40, height - scene.h - 100,
    FRAMES, scene);

var luxoBall = new Actor(timeline);
scene.addActor(luxoBall);
luxoBall.addAvar('x', 200, 0, scene.w);
luxoBall.addAvar('y', 0, 0, scene.h);
luxoBall.addAvar('sx', 32, 1, 64);
luxoBall.addAvar('sy', 32, 1, 64);
luxoBall.addAvar('a', 0, -180, 180);

/*********************************************
 *      Set up other GUI elements
**********************************************/
{
var playPause = function() {
    if (timeline.state === 'running') {
        timeline.state = 'paused';
    } else if (timeline.state === 'paused') {
        timeline.state = 'running';
    }
};

var playIcon = function(x, y, r) {
    noStroke();
    if (timeline.state === 'running') {
        rect(x - 4, y - 5, 3, 10, 5);
        rect(x + 1, y - 5, 3, 10, 5);
    } else {
        triangle(x - r * 0.4, y - r * 0.5, x - r * 0.4, y + r * 0.5, x + r * 0.65, y);
    }
};

var removeKeyFrame = function() {
    timeline.removeSelectedKeyFrame();
};

var buttonY = timeline.y + timeline.h + 10;
var playButton = new CircleButton(26, buttonY, 24, 24, playPause, playIcon);

removeButton = new Button(200, buttonY + 1, 125, 20, "Remove keyframe", removeKeyFrame);
removeButton.showing = false;

speedSlider = new Slider(80, buttonY + 20, 60, 'horizontal', 1, 5, 3);
}
/*********************************************
 *      Main loop
**********************************************/

draw = function() {
    background(BACKGROUND);
    
    scene.draw();
    timeline.draw();
    
    playButton.draw();
    
    if (timeline.state === 'paused') {
        removeButton.draw();    
    }
    
    // Extra GUI elements
    fill(TEXTCOL);
    textAlign(CENTER, BASELINE);
    textSize(13);
    text("Speed: " + speedSlider.value, speedSlider.x + speedSlider.length / 2, speedSlider.y - 10);
    speedSlider.draw();
};

/***********************************************
 *      Event handling
************************************************/

mousePressed = function() {
    timeline.mousePressed();
    speedSlider.selected();
};

mouseDragged = function() {
    timeline.mouseDragged();
    speedSlider.mouseDragged();
};

mouseReleased = function() {
    timeline.mouseReleased();
    playButton.mouseReleased();
    removeButton.mouseReleased();
    speedSlider.held = false;
};

mouseOut = function() {
    speedSlider.held = false;
};
