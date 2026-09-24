// Regenerate the approved Forward RD vectors and favicon assets.
// Run from any directory: node scripts/build-brand-assets.cjs
// Typography and lockup dimensions are unchanged; only the RD emblem is refined.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const sharp = require(path.join(root, 'node_modules/sharp'));
const out = path.join(root, 'public/brand');
const preview = path.join(root, 'output/logo-refinement');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(preview, { recursive: true });
const red = '#c8202a', charcoal = '#14161c';
const redPath = 'M24 0H160L224 64L184 104H136L192 160H152L96 104L40 160H0L80 80H168L128 40H64Z';
const dPath = 'M184 0H270L326 56V104L270 160H216L176 120H254L286 88V72L254 40H224Z';
function emblem(tone){ return `<g transform="translate(0 3)"><path fill="${red}" d="${redPath}"/><path fill="${tone}" d="${dPath}"/></g>`; }
function svg(body, w, h, label='Rai Dispatch'){ return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>\n`; }
// Original geometric letter outlines, drawn to follow the approved concept.
const glyph = {
 R:[100,'M0 0H64Q96 0 96 29V40Q96 58 75 63L100 100H66L43 65H30V100H0ZM30 24V43H58Q65 43 65 36V31Q65 24 58 24Z'],
 A:[104,'M0 100L37 0H67L104 100H74L67 80H35L28 100ZM43 57H59L51 33Z'],
 I:[31,'M0 0H31V100H0Z'],
 D:[99,'M0 0H66Q99 0 99 30V70Q99 100 66 100H0ZM31 24V76H61Q68 76 68 69V31Q68 24 61 24Z'],
 S:[98,'M98 0L86 25H38Q31 25 31 31V34Q31 39 38 39H67Q98 39 98 66V73Q98 100 67 100H0L12 75H60Q67 75 67 69V65Q67 60 60 60H31Q0 60 0 33V27Q0 0 31 0Z'],
 P:[96,'M0 0H64Q96 0 96 29V43Q96 71 64 71H31V100H0ZM31 24V47H58Q65 47 65 40V31Q65 24 58 24Z'],
 T:[100,'M0 0H100L95 25H65V100H34V25H5Z'],
 C:[98,'M98 0L87 25H38Q31 25 31 32V68Q31 75 38 75H87L98 100H32Q0 100 0 70V30Q0 0 32 0Z'],
 H:[98,'M0 0H31V38H67V0H98V100H67V63H31V100H0Z']
};
function wordmark(tone, width=839, height=84){
 const word='RAIDISPATCH'; let x=0; let shapes=[];
 for(let i=0;i<word.length;i++){ const [advance,d]=glyph[word[i]]; shapes.push(`<path fill="${i<3?red:tone}" fill-rule="evenodd" d="${d}" transform="translate(${x} 0)"/>`); x+=advance+(i===2?35:7); }
 const measured=x-7;
 return `<g transform="scale(${width/measured} ${height/100})">${shapes.join('')}</g>`;
}
// Preserve the previously approved subtitle outlines exactly; no system font dependency.
const subtitleOutline = "<g fill=\"#14161c\" transform=\"translate(369 159) scale(0.021757170271251493 -0.015089163237311385)\"><path d=\"M401 0L623 0L623 1261L1022 1261L1022 1458L2 1458L2 1261L401 1261Z\" transform=\"translate(0 0)\"/><path d=\"M375 1261L721 1261Q827 1261 883 1216Q954 1165 956 1051Q956 956 895 891Q833 821 709 819L375 819ZM154 0L375 0L375 623L657 623L958 0L1221 0L883 647Q1161 754 1165 1051Q1159 1253 1020 1362Q905 1458 723 1458L154 1458Z\" transform=\"translate(1674 0)\"/><path d=\"M127 494Q129 264 279 129Q426 -10 645 -12Q868 -10 1014 129Q1159 264 1163 494L1163 1458L942 1458L942 518Q940 369 858 291Q774 209 645 209Q516 209 434 291Q350 369 348 518L348 1458L127 1458Z\" transform=\"translate(3573 0)\"/><path d=\"M903 408Q811 209 625 209Q547 209 491 242Q434 270 399 315Q356 362 342 438Q326 514 326 729Q326 944 342 1022Q356 1096 399 1143Q434 1188 491 1218Q547 1247 625 1249Q731 1247 805 1188Q876 1126 903 1038L1137 1038Q1102 1221 969 1345Q836 1468 625 1470Q453 1468 338 1388Q221 1309 168 1208Q135 1155 119 1069Q104 983 104 729Q104 479 119 391Q127 344 139 313Q152 283 168 250Q221 149 338 72Q453 -8 625 -12Q815 -12 954 96Q1089 205 1137 408Z\" transform=\"translate(5513 0)\"/><path d=\"M154 0L375 0L375 444L631 713L631 713L1028 0L1290 0L774 883L1241 1458L979 1458L379 707L375 707L375 1458L154 1458Z\" transform=\"translate(7302 0)\"/><path d=\"\" transform=\"translate(9242 0)\"/><path d=\"M154 0L649 0Q813 0 926 72Q1040 139 1104 242Q1128 281 1145 317Q1161 354 1169 401Q1186 494 1186 729Q1186 950 1175 1040Q1161 1130 1108 1212Q960 1456 664 1458L154 1458ZM375 1249L639 1249Q807 1253 899 1126Q944 1075 956 993Q965 911 965 721Q965 526 956 455Q946 383 909 336Q825 209 639 209L375 209Z\" transform=\"translate(10383 0)\"/><path d=\"M154 0L375 0L375 1458L154 1458Z\" transform=\"translate(12323 0)\"/><path d=\"M172 354L27 188Q260 -12 584 -12Q1085 -6 1096 412Q1096 567 999 684Q901 803 696 831Q592 844 532 854Q424 874 375 926Q326 977 326 1040Q328 1145 399 1198Q467 1249 569 1249Q766 1245 930 1137L930 1137L1053 1319Q852 1464 580 1470Q354 1468 231 1352Q104 1235 104 1044Q104 885 205 774Q303 666 491 635Q596 620 684 608Q876 575 874 412Q870 213 586 209Q346 211 172 354Z\" transform=\"translate(13501 0)\"/><path d=\"M375 1249L694 1249Q784 1251 852 1208Q897 1182 922 1137Q946 1087 946 1014Q946 926 887 854Q825 780 702 778L375 778ZM154 0L375 0L375 569L711 569Q936 573 1053 713Q1167 846 1167 1008Q1167 1128 1122 1216Q1079 1307 1010 1356Q928 1421 848 1442Q768 1458 682 1458L154 1458Z\" transform=\"translate(15326 0)\"/><path d=\"M412 522L623 1159L627 1159L838 522ZM1014 0L1247 0L717 1458L532 1458L2 0L236 0L348 326L901 326Z\" transform=\"translate(17038 0)\"/><path d=\"M401 0L623 0L623 1261L1022 1261L1022 1458L2 1458L2 1261L401 1261Z\" transform=\"translate(18785 0)\"/><path d=\"M903 408Q811 209 625 209Q547 209 491 242Q434 270 399 315Q356 362 342 438Q326 514 326 729Q326 944 342 1022Q356 1096 399 1143Q434 1188 491 1218Q547 1247 625 1249Q731 1247 805 1188Q876 1126 903 1038L1137 1038Q1102 1221 969 1345Q836 1468 625 1470Q453 1468 338 1388Q221 1309 168 1208Q135 1155 119 1069Q104 983 104 729Q104 479 119 391Q127 344 139 313Q152 283 168 250Q221 149 338 72Q453 -8 625 -12Q815 -12 954 96Q1089 205 1137 408Z\" transform=\"translate(20459 0)\"/><path d=\"M952 0L1173 0L1173 1458L952 1458L952 833L375 833L375 1458L154 1458L154 0L375 0L375 637L952 637Z\" transform=\"translate(22248 0)\"/><path d=\"\" transform=\"translate(24225 0)\"/><path d=\"M172 354L27 188Q260 -12 584 -12Q1085 -6 1096 412Q1096 567 999 684Q901 803 696 831Q592 844 532 854Q424 874 375 926Q326 977 326 1040Q328 1145 399 1198Q467 1249 569 1249Q766 1245 930 1137L930 1137L1053 1319Q852 1464 580 1470Q354 1468 231 1352Q104 1235 104 1044Q104 885 205 774Q303 666 491 635Q596 620 684 608Q876 575 874 412Q870 213 586 209Q346 211 172 354Z\" transform=\"translate(25366 0)\"/><path d=\"M154 0L1085 0L1085 209L375 209L375 637L981 637L981 833L375 833L375 1249L1085 1249L1085 1458L154 1458Z\" transform=\"translate(27191 0)\"/><path d=\"M375 1261L721 1261Q827 1261 883 1216Q954 1165 956 1051Q956 956 895 891Q833 821 709 819L375 819ZM154 0L375 0L375 623L657 623L958 0L1221 0L883 647Q1161 754 1165 1051Q1159 1253 1020 1362Q905 1458 723 1458L154 1458Z\" transform=\"translate(28980 0)\"/><path d=\"M483 0L655 0L1137 1458L903 1458L571 348L567 348L236 1458L2 1458Z\" transform=\"translate(30842 0)\"/><path d=\"M154 0L375 0L375 1458L154 1458Z\" transform=\"translate(32631 0)\"/><path d=\"M903 408Q811 209 625 209Q547 209 491 242Q434 270 399 315Q356 362 342 438Q326 514 326 729Q326 944 342 1022Q356 1096 399 1143Q434 1188 491 1218Q547 1247 625 1249Q731 1247 805 1188Q876 1126 903 1038L1137 1038Q1102 1221 969 1345Q836 1468 625 1470Q453 1468 338 1388Q221 1309 168 1208Q135 1155 119 1069Q104 983 104 729Q104 479 119 391Q127 344 139 313Q152 283 168 250Q221 149 338 72Q453 -8 625 -12Q815 -12 954 96Q1089 205 1137 408Z\" transform=\"translate(33809 0)\"/><path d=\"M154 0L1085 0L1085 209L375 209L375 637L981 637L981 833L375 833L375 1249L1085 1249L1085 1458L154 1458Z\" transform=\"translate(35598 0)\"/><path d=\"M172 354L27 188Q260 -12 584 -12Q1085 -6 1096 412Q1096 567 999 684Q901 803 696 831Q592 844 532 854Q424 874 375 926Q326 977 326 1040Q328 1145 399 1198Q467 1249 569 1249Q766 1245 930 1137L930 1137L1053 1319Q852 1464 580 1470Q354 1468 231 1352Q104 1235 104 1044Q104 885 205 774Q303 666 491 635Q596 620 684 608Q876 575 874 412Q870 213 586 209Q346 211 172 354Z\" transform=\"translate(37387 0)\"/></g>";
function subtitle(tone){ return subtitleOutline.replace('fill="#14161c"', `fill="${tone}"`); }
const assets={};
for(const [variant,tone] of [['light',charcoal],['dark','#ffffff']]){
 assets[`rai-dispatch-mark-${variant}.svg`]=svg(emblem(tone),327,166);
 assets[`rai-dispatch-logo-${variant}.svg`]=svg(emblem(tone)+`<g transform="translate(369 34)">${wordmark(tone)}</g>`+subtitle(tone),1208,166);
 assets[`rai-dispatch-logo-compact-${variant}.svg`]=svg(`<g transform="translate(0 18) scale(.72)">${emblem(tone)}</g><g transform="translate(264 37)">${wordmark(tone,730,78)}</g>`,1000,156);
}
const iconBody=`<rect width="512" height="512" rx="92" fill="${charcoal}"/><g transform="translate(36 144) scale(1.3456)">${emblem('#ffffff')}</g>`;
assets['rai-dispatch-icon.svg']=svg(iconBody,512,512);
for(const [file,data] of Object.entries(assets)){
 fs.writeFileSync(path.join(out,file),data);
 fs.writeFileSync(path.join(preview,file),data);
}
const publicRoot=path.join(root,'public');
fs.writeFileSync(path.join(publicRoot,'favicon.svg'),assets['rai-dispatch-icon.svg']);
const sizes=[['favicon-16x16.png',16],['favicon-32x32.png',32],['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]];
(async()=>{
 const pngs={};
 for(const [file,size] of sizes){
  const buf=await sharp(Buffer.from(assets['rai-dispatch-icon.svg']),{density:192}).resize(size,size,{kernel:'lanczos3'}).png().toBuffer();
  fs.writeFileSync(path.join(publicRoot,file),buf); fs.writeFileSync(path.join(preview,file),buf); pngs[size]=buf;
 }
 // ICO directory containing the native 16px and 32px PNG frames.
 const frames=[16,32], header=Buffer.alloc(6+16*frames.length); header.writeUInt16LE(1,2);header.writeUInt16LE(frames.length,4);
 let offset=header.length;
 frames.forEach((size,i)=>{const at=6+16*i,b=pngs[size];header[at]=size;header[at+1]=size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(b.length,at+8);header.writeUInt32LE(offset,at+12);offset+=b.length;});
 const ico=Buffer.concat([header,...frames.map(s=>pngs[s])]);fs.writeFileSync(path.join(publicRoot,'favicon.ico'),ico);fs.writeFileSync(path.join(preview,'favicon.ico'),ico);
 const proof=`<svg xmlns="http://www.w3.org/2000/svg" width="1450" height="650"><rect width="1450" height="650" fill="#f4f4f2"/><rect x="40" y="38" width="1370" height="218" rx="12" fill="white"/><g transform="translate(112 65)">${assets['rai-dispatch-logo-light.svg'].replace('<svg ','<svg width="1208" height="166" ')}</g><rect x="40" y="286" width="1370" height="218" rx="12" fill="${charcoal}"/><g transform="translate(112 312)">${assets['rai-dispatch-logo-dark.svg'].replace('<svg ','<svg width="1208" height="166" ')}</g><g transform="translate(90 546) scale(.15)">${iconBody}</g><g transform="translate(210 562) scale(.095)">${iconBody}</g><g transform="translate(300 574) scale(.0625)">${iconBody}</g><g transform="translate(360 582) scale(.03125)">${iconBody}</g><text x="438" y="595" fill="${charcoal}" font-family="Arial,sans-serif" font-size="24">Refined Forward RD — connected R and clearer favicon</text></svg>`;
 await sharp(Buffer.from(proof)).png().toFile(path.join(preview,'forward-rd-refined-production-proof.png'));
 console.log('Saved 7 SVG brand assets, 7 public icon files, and production proof.');
})();
