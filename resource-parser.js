/*
  Bản dịch tiếng Việt của resource-parser.js — Quantumult X Resource Parser
  Tác giả gốc: Shawn — https://github.com/KOP-XIAO/QuantumultX
  Bản dịch này chỉ dịch phần giải thích, nhãn giao diện và thông báo sang tiếng Việt.
  Logic, tham số, URL và credit gốc được giữ nguyên.
  Lưu ý: các từ khóa dùng để khớp tên node (ví dụ tên khu vực tiếng Trung),
  bảng gán cờ emoji theo tên node và một số token nội bộ được giữ nguyên
  cố ý, vì dịch chúng sẽ làm hỏng chức năng nhận diện/lọc node.
*/

/** 
☑️ Trình phân tích tài nguyên ©𝐒𝐡𝐚𝐰𝐧  ⟦2026-10-13 12:49⟧
----------------------------------------------------------
🛠 Phát hiện 𝐁𝐔𝐆, vui lòng phản hồi tại: https://t.me/ShawnKOP_Parser_Bot
⛳️ Theo dõi kênh 🆃🅶 liên quan: https://t.me/QuanX_API
📖 Hướng dẫn sử dụng: https://tinyurl.com/2jyygfom
🗣 🆃🄷🄰🄽🄺🅂 🆃🄾  @Jamie CHIEN, @M**F**, @c0lada, @Peng-YM, @vinewx, @love4taylor, @shadowdogy 

🤖 Chức năng chính: 
❶ Chuyển đổi ⟦subscription server⟧ ở định dạng khác sang định dạng 𝐐𝐮𝐚𝐧𝐭𝐮𝐦𝐮𝐥𝐭 𝐗
☑︎ Hỗ trợ 𝐕2𝐫𝐚𝐲𝐍/𝗦𝗦(𝗥/𝗗)/𝗧𝗿𝗼𝗷𝗮𝗻/𝐕𝐋𝗲𝐬𝐬/𝗛𝗧𝗧𝗣(𝗦)/𝗔𝗻𝘆𝗧𝗟𝗦/𝗤𝘂𝗮𝗻𝘁𝘂𝗺𝘂𝗹𝘁(𝗫)/𝗦𝘂𝗿𝗴𝗲/𝐂𝐥𝐚𝐬𝐡/𝐒𝐡𝐚𝐝𝐨𝐰𝐫𝐨𝐜𝐤𝐞𝐭/𝐋𝐨𝐨𝐧 định dạng
☑︎ Cung cấp các tham số cá nhân hóa tùy chọn trong mục 1⃣️ (lọc, đổi tên, v.v.)
☑︎ Khi quét mã node nhận diện được link nghi là subscription, nhấn vào thông báo để chuyển sang thêm subscription node
❷ Chuyển đổi & lọc 𝗿𝗲𝘄𝗿𝗶𝘁𝗲 (viết lại) & 𝗳𝗶𝗹𝘁𝗲𝗿 (phân luồng) 
☑︎ Dùng để vô hiệu hóa/sửa một (vài) mục 𝗿𝗲𝘄𝗿𝗶𝘁𝗲/𝗵𝗼𝘀𝘁𝗻𝗮𝗺𝗲/𝗳𝗶𝗹𝘁𝗲𝗿 trong tham chiếu từ xa
☑︎ Phân tích và sử dụng rule dạng 𝗹𝗶𝘀𝘁 kiểu 𝐒𝐮𝐫𝐠𝐞/𝐂𝐥𝐚𝐬𝐡 và module 𝐦𝐨𝐝𝐮𝐥𝐞
----------------------------------------------------------
0️⃣ Thêm "#" sau ⟦link subscription⟧ để dùng, các tham số khác nhau nối bằng "&" 
⚠️ ☞ "link subscription của bạn#emoji=1&tfo=1&in=香港+台湾"
❖ Đường dẫn local/iCloud cũng hỗ trợ "#in=xxx&out=yyy"; tham số đường dẫn được ưu tiên, khi không cung cấp sẽ tương thích với tham số # ở dòng ① của đoạn tài nguyên
❖ Filter/viết lại hỗ trợ ghi chú đầu dòng {# note #}: bản 950+ giữ lại ghi chú, bản cũ chỉ xuất nội dung rule; lọc, thay thế và sửa policy chỉ tác động lên nội dung chính
❖ 🚦 Hỗ trợ tiếng Trung, khi "thao tác" với các ký tự đặc biệt dưới đây hãy thay thế trước (URL-Encode) 🚦
  ∎ "+"⇒"%2B", khoảng trắng⇒"%20", "@"⇒"%40", "&"⇒"%26", "."⇒"\.", ","⇒"%2C"

1️⃣ ⟦node 𝐬𝐞𝐫𝐯𝐞𝐫⟧ ➠ Giải thích tham số:
⦿ emoji=1 (thiết bị bản Trung Quốc dùng 2)/-1, thêm/xóa cờ khu vực trong tên node;
⦿ udp=1/-1, tfo=1/-1, lần lượt ép bật (tắt) 𝐮𝐝𝐩-𝐫𝐞𝐥𝐚𝐲/𝐟𝐚𝐬𝐭-𝐨𝐩𝐞𝐧;
⦿ uot=1, bật tùy chọn udp-over-tcp=true (chỉ SS(R))
⦿ cert=1/-1/domain, lần lượt bật/tắt xác minh chứng chỉ 𝐭𝐥𝐬; bản 938+ hỗ trợ domain làm tên miền xác minh chứng chỉ tls-verification (mặc định tắt);
  ❖ Tham số csha/psha, tls-cert-sha256 và tls-pubkey-sha256
  ❖ alpn, chỉ định tham số alpn cho node kiểu over-tls
⦿ in, out, regex, regout lần lượt là giữ lại, xóa, giữ lại theo regex, xóa theo regex node;
  ❖ in/out chỉ có hiệu lực khi khớp tên node, nhiều tham số (logic "hoặc") dùng "+", logic "và" dùng "." để biểu thị;
  ❖ regex/regout khớp với toàn bộ thông tin của node (loại, cổng, mã hóa, v.v.);
  ❖ Ví dụ: "in=香港.0\.2倍率+台湾&out=BGP&regex=iplc"
⦿ rename Đổi tên, "tên cũ@tên mới", "tiền tố@", "@hậu tố", nối nhiều tham số bằng "+";
  ❖ Xóa trường: "trường1.trường2☠️", muốn xóa "." thì dùng "\." thay thế
  ❖ Ví dụ: "rename=香港@𝐇𝐊+[𝐒𝐒]@+@[1𝐗]+流量.0\.2☠️"
  ❖ Mặc định emoji có hiệu lực trước, nếu muốn đổi thứ tự, hãy dùng tham số rrname
⦿ replace Thay thế bằng regex trường trong node, có thể dùng để đổi tên/thay đổi phương thức mã hóa, v.v.
  ❖ replace=regex1@𝘀𝘁𝗿1+regex2@𝘀𝘁𝗿2
⦿ ptn/npt=1-8, thay chữ cái/số trong tên node thành kiểu ⇒ 🅰/🄰/𝐀/𝗮/𝔸/𝕒/ᵃ/ᴬ, ①\❶\⓵\𝟙\¹\₁\𝟏\𝟷
⦿ delreg, dùng biểu thức chính quy để xóa trường trong "tên node" (⚠️ dùng cẩn thận)
⦿ UA=1, sẽ thử dùng UA của shadowrocket để lấy lại thông tin node
⦿ aead=-1, tắt tham số AEAD của Vmess
⦿ host=xxx, sửa host đã có, nếu muốn thêm host, hãy kết thúc bằng ☠️
⦿ obfs=vhttp/shttp, chỉ định nhu cầu đặc biệt obfs=shadowsocks-http hoặc obfs=vmess-http
⦿ tsession=0/1/2, 0/1 nghĩa là tắt tls-session-ticket/reuse, 2 nghĩa là tắt tất cả
⦿ checkurl=xxx, chỉ định tham số server_check_url
⦿ sort=1/-1/x/quy tắc tham số, sắp xếp theo tên node theo thứ tự thuận/ngược/ngẫu nhiên/quy tắc tham số
  ❖ Quy tắc tham số là biểu thức chính quy hoặc từ khóa đơn giản, nối bằng "<" hoặc ">"
  ❖ sort=🇭🇰>🇸🇬>🇯🇵>🇺🇸, sắp xếp lên trước
  ❖ sort=IEPL<IPLC<BGP, sắp xếp về sau
⦿ info=1, bật thông báo nhắc thông tin lưu lượng ✈️ của nhà cung cấp (nếu có cung cấp);
⦿ flow=2022-06-02:1000:54, ngày hết hạn subscription:tổng lưu lượng:đã dùng
⦿ Placeholder, có thể dùng cho các thao tác rename/replace, v.v.
  ❖ Placeholder $type0/1/2/3/4/5/6/7, đưa loại node (ss/ssr/vmess, v.v.) làm tham số có thể thao tác, ví dụ
    ∎ rename=@|$type2
    ∎ Các kiểu lần lượt là "𝐬𝐬","𝐒𝐒","🅢🅢","🆂🆂","ⓢⓢ","🅂🅂","𝕊𝕊","ˢˢ"
  ❖ Placeholder $index0/1/2/3/4/5/6/7/8, đưa số thứ tự của node làm tham số có thể thao tác, ví dụ
    ∎ rename=@「$index1」
    ∎ Các kiểu lần lượt là 1\①\❶\⓵\𝟙\¹\₁\𝟏\𝟷
  ❖ Placeholder $emoji1/2, đưa emoji (🇭🇰, v.v.) làm tham số có thể thao tác
    ∎ rename=@「$emoji1」
  ❖ Placeholder $tag, đưa tag của subscription làm tham số có thể thao tác, ví dụ
    ∎ Có thể nối thêm số để riêng thêm kiểu chữ/số cho tag
    ∎ rename=@「$tag34」, kiểu giống ptn/npt bên dưới
⦿ ⟦Tham số nâng cao⟧: 𝘀𝗳𝗶𝗹𝘁𝗲𝗿/𝘀𝗿𝗲𝗻𝗮𝗺𝗲, truyền vào một đoạn script mã hóa base64, có thể dùng cho nhu cầu [lọc/đổi tên] phức tạp hơn
  ❖ Giải thích: https://github.com/KOP-XIAO/QuantumultX/pull/9

2⃣️ ⟦𝐫𝐞𝐰𝐫𝐢𝐭𝐞 Viết lại⟧/⟦𝐟𝐢𝐥𝐭𝐞𝐫 Phân luồng⟧ ➠ Giải thích tham số:
⦿ in, out, giữ lại/vô hiệu hóa rule phân luồng, viết lại liên quan theo từ khóa;
⦿ inhn, outhn, "giữ lại/xóa" hostname (𝒉𝒐𝒔𝒕𝒏𝒂𝒎𝒆);
  ❖ Ví dụ: vô hiệu hóa js cùng hostname của "so sánh giá Taobao" và "weibo"
  𝐡𝐭𝐭𝐩𝐬://𝐦𝐲𝐥𝐢𝐬𝐭#out=tb_price.js+wb_ad.js&outhn=weibo
⦿ regex/regout, giữ lại/xóa theo regex, tự mày mò biểu thức chính quy;
  ❖ Có thể dùng cùng in(hn)/out(hn), in(hn)/out(hn) sẽ được thực thi ưu tiên;
  ❖ Có hiệu lực đồng thời với 𝒉𝒐𝒔𝒕𝒏𝒂𝒎𝒆 & 𝐫𝐞𝐰𝐫𝐢𝐭𝐞/𝐟𝐢𝐥𝐭𝐞𝐫 (⚠️ dùng cẩn thận)
⦿ Tham số policy, dùng để chỉ định trực tiếp nhóm policy, hoặc tạo nhóm policy cho 𝗿𝘂𝗹𝗲-𝘀𝗲𝘁 kiểu 𝐒𝐮𝐫𝐠𝐞 (mặc định nhóm policy "𝐒𝐡𝐚𝐰𝐧");
⦿ pset=regex1@policy1+regex2@policy2, chỉ định nhóm policy khác nhau cho các từ khóa khác nhau (cho phép biểu thức chính quy) trong cùng một rule phân luồng;
⦿ Tham số replace, thay thế bằng regex nội dung 𝐟𝐢𝐥𝐭𝐞𝐫/𝐫𝐞𝐰𝐫𝐢𝐭𝐞, regex@newregex;
  ❖ Thay script trong so sánh giá Taobao thành bản lite (nếu có bản script này)
    ∎ replace=(price)(.*)@$1_lite$2
⦿ dst=rewrite/filter, lần lượt là chuyển 𝐦𝐨𝐝𝐮𝐥𝐞 & 𝗿𝘂𝗹𝗲-𝘀𝗲𝘁 thành viết lại/phân luồng;
  ❖ ⚠️ Mặc định chuyển 𝐦𝐨𝐝𝐮𝐥𝐞 thành viết lại, 𝗿𝘂𝗹𝗲-𝘀𝗲𝘁 thành phân luồng
  ❖ ⚠️ Khi chuyển url-regex trong 𝗿𝘂𝗹𝗲-𝘀𝗲𝘁 thành viết lại, bắt buộc phải thêm dst=rewrite;
  ❖ ⚠️ Khi chuyển rule phân luồng trong 𝐦𝐨𝐝𝐮𝐥𝐞, bắt buộc phải thêm dst=filter
⦿ cdn=1, chuyển địa chỉ script github thành fastly.jsdelivr.net/gh không cần vượt tường lửa
⦿ fcr=1/2/3, thêm tham số force-cellular/multi-interface/multi-interface-balance cho rule phân luồng, ép dùng dữ liệu di động/dữ liệu hỗn hợp/cân bằng tải
⦿ via=giao diện, thêm tham số via-interface cho rule phân luồng, 0 nghĩa là via-interface=%TUN%
⦿ relay=tên policy đích, chuyển hàng loạt subscription node thành rule ip/host, dùng để thực hiện chuỗi proxy

3⃣️ Các tham số khác
⦿ Tham số thông báo ntf=0/1, dùng để tắt/bật thông báo nhắc của trình phân tích tài nguyên
  ❖ 𝗿𝗲𝘄𝗿𝗶𝘁𝗲/𝗳𝗶𝗹𝘁𝗲𝗿 mặc định "bật" thông báo nhắc, để tránh xóa nhầm rule
  ❖ Phân tích tài nguyên 𝘀𝗲𝗿𝘃𝗲𝗿 thì mặc định "tắt" thông báo nhắc
⦿ Tham số loại type=domain-set/rule/module/list/nodes
  ❖ Khi trình phân tích không nhận diện đúng loại, có thể thử dùng tham số này để ép chỉ định
⦿ Tham số ẩn hide=0, vô hiệu hóa việc sàng lọc filter/viết lại, cách mặc định là xóa
⦿ profile=111, thêm tài nguyên từ xa trong cấu hình kiểu QuanX qua URL-Scheme
----------------------------------------------------------
*/

/**
* Hướng dẫn sử dụng,
0️⃣ Trong phần [general] của file cấu hình QuantumultX, thêm 
resource_parser_url = https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/resource-parser.js
⚠️⚠️ Nếu báo "không có trình phân tích tùy chỉnh", hãy nhấn giữ biểu tượng góc dưới bên phải rồi nhấn nút làm mới bên trái, cập nhật tài nguyên, thoát app ở nền, cho đến khi xuất hiện hướng dẫn trình phân tích

------------------------------
*/

// ==== Parser Helper UI by Quantumult-X (918+) ====
var $parser = $parser || {};

// schema: toàn bộ tham số do tác giả khai báo (không kèm value)
$parser.hashSchema = function () {
  // helper phải được định nghĩa bên trong thân hàm — giao thức yêu cầu ba hàm tự chứa
  function _emojiOptions() {
    return [
      { label: "Thêm",     value: "1"  },
      { label: "Thiết bị bản Trung Quốc", value: "2"  },
      { label: "Xóa",     value: "-1" }
    ];
  }
  function _ptnOptions() {
    return [
      { label: "Giữ nguyên",         value: ""  },
      { label: "🅰 Chữ khối vuông",   value: "1" },
      { label: "🄰 Chữ khối vuông (đặc)", value: "2" },
      { label: "𝐀 In đậm",        value: "3" },
      { label: "𝗮 In đậm chữ thường",    value: "4" },
      { label: "𝔸 Nét đôi",        value: "5" },
      { label: "𝕒 Nét đôi chữ thường",    value: "6" },
      { label: "ᵃ Chỉ số trên",        value: "7" },
      { label: "ᴬ Chỉ số trên chữ hoa",    value: "8" }
    ];
  }
  function _nptOptions() {
    return [
      { label: "Giữ nguyên",         value: ""  },
      { label: "①",            value: "1" },
      { label: "❶",            value: "2" },
      { label: "⓵",            value: "3" },
      { label: "𝟙",            value: "4" },
      { label: "¹",            value: "5" },
      { label: "₁",            value: "6" },
      { label: "𝟏",            value: "7" },
      { label: "𝟷",            value: "8" }
    ];
  }

  if ($resource.type == "server") { // nội dung server
    return {
    version: 1,
    sections: [
      { type: "group",
        title: "✈️ Lấy subscription",
        items: [
          { type: "switch", key: "UA", label: "Thay thế User-Agent",
            onValue: "1", offValue: "" ,
            description: "Sau khi bật tùy chọn này, sẽ thử dùng User-Agent của Shadowrocket để lấy lại nội dung subscription"}
          ]
      },
      {
        type: "group",
        title: "🎲 Lọc & sắp xếp",
        items: [
          { type: "tags",   key: "in",     label: "Giữ lại (in)",
            description: "Giữ lại theo từ khóa tên node. Mỗi dòng một từ khóa nghĩa là \"hoặc\"; cùng dòng dùng . ngăn cách nghĩa là \"và\". Ví dụ: xuống dòng điền 香港、台湾 nghĩa là chỉ cần chứa một trong hai; cùng dòng điền 香港.IPLC nghĩa là đồng thời chứa 香港 và IPLC.",
            placeholder: "VD: 香港 / 香港.IPLC" },
          { type: "tags",   key: "out",    label: "Xóa (out)",
            description: "Xóa theo từ khóa tên node. Mỗi dòng một từ khóa nghĩa là\"hoặc\";cùng dòng dùng . ngăn cách nghĩa là\"và\".",
            placeholder: "VD: BGP / BGP.试用" },
          { type: "text",   key: "regex",  label: "Giữ lại theo regex (regex)",
            description: "Khớp regex với toàn bộ thông tin node để giữ lại node", placeholder: "iplc" },
          { type: "text",   key: "regout", label: "Xóa theo regex (regout)",
            description: "Khớp regex với toàn bộ thông tin node để xóa node", placeholder: "" },
          { type: "text",   key: "sort", label: "Sắp xếp node (sort)",
            description: "Sắp xếp node, tham số là 1 (thuận)/-1 (ngược)/x (ngẫu nhiên)/quy tắc tùy chỉnh (nối bằng > hoặc <)", placeholder: "🇭🇰>🇯🇵>🇺🇸" }
        ]
      },
      {
        type: "group",
        title: "⛰️ Điều chỉnh tham số",
        items: [
          { type: "select", key: "emoji", label: "Cờ Emoji (🇨🇳🇭🇰🇺🇸...)",
            description: "Thêm/xóa cờ khu vực trong tên node", options: _emojiOptions() },
          { type: "text",   key: "replace", label: "Thay thế thông tin node bằng regex (replace)",
            description: "Thay thế thông tin node (⚠️ có thể khớp mọi nội dung ⚠️), regex1@str1+regex2@str2", placeholder: "" },
          { type: "switch", key: "udp",   label: "UDP Relay",
            onValue: "1", offValue: "-1" },
          { type: "switch", key: "tfo",   label: "Fast Open",
            onValue: "1", offValue: "-1" },
          { type: "switch", key: "cert",  label: "Xác minh chứng chỉ TLS",
            description: "Mặc định tắt", onValue: "1", offValue: "-1" },
          { type: "switch", key: "uot",   label: "UDP over TCP (chỉ SS/SSR)",
            onValue: "1", offValue: "" },
          { type: "switch", key: "aead",  label: "VMess AEAD",
            description: "Tắt VMess AEAD", onValue: "", offValue: "-1" },
          { type: "text",   key: "alpn",  label: "ALPN",
            description: "ALPN của node over-tls", placeholder: "h2" },
          { type: "text",   key: "host",  label: "Host",
            description: "Sửa host đã có; thêm host hãy thêm ☠️ ở cuối",
            placeholder: "" },
          { type: "text",   key: "checkurl", label: "Check URL",
            description: "Tham số server_check_url",
            placeholder: "http://...", keyboard: "url" }
        ]
      },
      {
        type: "group",
        title: "🎯 Đổi tên",
        items: [
          { type: "text", key: "rename",  label: "Đổi tên node (Rename)",
            description: "Định dạng: tên cũ@tên mới / tiền tố@ / @hậu tố; nhiều nhóm nối bằng +; xóa trường dùng ☠️ ở cuối",
            placeholder: "香港@HK+@[1X]" },
          { type: "text", key: "rrname",  label: "Đổi tên node (emoji giữ ở trước)",
            description: "Đổi tên lại sau emoji", placeholder: "" },
          { type: "select", key: "ptn", label: "Kiểu chữ cái (ptn)",
            description: "Thay chữ cái tiếng Anh trong tên node thành kiểu hoa văn 🅰/🄰/𝐀/𝗮/𝔸/𝕒/ᵃ/ᴬ ",
            options: _ptnOptions() },
          { type: "select", key: "npt", label: "Kiểu số (npt)",
            description: "Thay số trong tên node thành kiểu hoa văn ①/❶/⓵/𝟙/¹/₁/𝟏/𝟷",
            options: _nptOptions() }
        ]
      },
      {
        type: "group",
        title: "🤖 Tham số khác",
        items: [
          { type: "select", key: "ntf",  label: "Thông báo phân tích",
            options: [
              { label: "Mặc định",          value: "" },
              { label: "Tắt",          value: "0"},
              { label: "Bật",          value: "1"}
            ] },
          { type: "switch", key: "info", label: "Thông tin lưu lượng",
            onValue: "1", offValue: "", description: "Đẩy dưới dạng thông báo các thông tin như \"lượng dùng subscription\" và \"thời gian hết hạn\""},
          { type: "text",   key: "flow", label: "Tham số lưu lượng",
            description: "Định dạng: thời gian hết hạn:tổng lưu lượng GB:đã dùng GB (VD 2026-12-31:1000:54)",
            placeholder: "2026-12-31:1000:54" },
          { type: "select", key: "type", label: "Ép kiểu",
            options: [
              { label: "Tự động",         value: ""           },
              { label: "Nodes",        value: "nodes"      },
              { label: "Rule",         value: "rule"       },
              { label: "Module",       value: "module"     },
              { label: "List",         value: "list"       },
              { label: "Domain Set",   value: "domain-set" }
            ] }
        ]
      }
    ]
  };
} else if ($resource.type == "filter") { // nội dung rule
  return {
    version: 1,
    sections: [
      {
        type: "group",
        title: "🔀 Filter 「Phân luồng」",
        description: "Chỉ có hiệu lực với rewrite_remote / filter_remote",
        items: [
          { type: "tags", key: "in",  label: "Giữ lại rule phân luồng「in」",
            description: "Giữ lại filter theo từ khóa. Mỗi dòng một từ khóa (giữa các dòng là quan hệ \"hoặc\").",
            placeholder: "VD: weibo" },
          { type: "tags", key: "out",  label: "Vô hiệu hóa phân luồng/viết lại「out」",
            description: "Giữ lại filter theo từ khóa. Mỗi dòng một từ khóa (giữa các dòng là quan hệ \"hoặc\").",
            placeholder: "VD: weibo" },
          { type: "text", key: "policy", label: "Chỉ định một nhóm policy「policy」",
            description: "Tên nhóm policy do rule-set tạo ra (mặc định Shawn)",
            placeholder: "Shawn" },
          { type: "text", key: "pset",   label: "Chỉ định nhiều nhóm policy「pset」",
            description: "regex1@policy1+regex2@policy2" },
          { type: "text", key: "regex",   label: "Giữ lại theo regex「regex」",
            description: "Khớp regex để giữ lại nội dung chỉ định" },
          { type: "text", key: "regout",   label: "Xóa theo regex「regout」",
            description: "Khớp regex để xóa nội dung chỉ định" },
          { type: "text", key: "replace",   label: "Thay thế theo regex「replace」",
            description: "regex@new_regex thay thế bằng regex nội dung chỉ định" }
        ]
      },
      {
        type : "group",
        title: "🔗 Cài đặt liên quan chuỗi proxy「Relay」",
        items : [
          { type: "text", key: "via",    label: "via-interface「subscription rule」",
             description: "0 : via-interface=%TUN%, khi thiết lập chuỗi proxy, phân luồng rule cần dùng tham số này, hãy trong tùy chọn policy chỉ định nhóm policy thành nhóm policy/node đích cuối\n" ,
             placeholder: "Chỉ cần điền 0" 
          },
          { type: "text",   key: "relay", label: "Chuỗi proxy Relay「subscription node」",
            description: "Chuyển subscription của node (đích cuối) thành rule ip/host, trỏ tới nhóm policy/node trung chuyển.\n ⚠️ Khi thiết lập chuỗi proxy Relay, hãy đảm bảo tắt cài đặt「Tùy chọn policy」ở trang đầu của subscription này \n\n ⚠️ Hai mục trên không nên được đặt đồng thời trong cùng một tham chiếu ⚠️" ,
            placeholder: "⚠️ Tại đây hãy điền tên nhóm policy/node trung chuyển của bạn" },
           
        ]
      },
      {
        type: "group",
        title: "🤖 Tham số khác",
        items: [
          { type: "select", key: "ntf",  label: "Thông báo phân tích",
            options: [
              { label: "Mặc định",          value: "" },
              { label: "Tắt",          value: "0"},
              { label: "Bật",          value: "1"}
            ] },
          { type: "select", key: "type", label: "Ép kiểu",
            options: [
              { label: "Tự động",         value: ""           },
              { label: "Nodes",        value: "nodes"      },
              { label: "Rule",         value: "rule"       },
              { label: "Module",       value: "module"     },
              { label: "List",         value: "list"       },
              { label: "Domain Set",   value: "domain-set" }
            ] },
          { type: "switch", key: "cdn",  label: "Tăng tốc GitHub CDN",
            onValue: "1", offValue: "" },
          { type: "select", key: "dst", label: "Mục tiêu chuyển đổi「dst」",
            options: [
              { label: "Mặc định (không chuyển đổi)", value: ""        },
              { label: "Rewrite",        value: "rewrite" },
              { label: "Filter",         value: "filter"  }
            ] },
          { type: "select", key: "fcr",  label: "Chỉ định giao diện mạng「fcr」",
            options: [
              { label: "Mặc định",            value: ""  },
              { label: "Ép dữ liệu di động",    value: "1" },
              { label: "Giao diện hỗn hợp",        value: "2" },
              { label: "Cân bằng tải",        value: "3" }
            ] , description:"Ép chỉ định \"ép dữ liệu di động/giao diện hỗn hợp/cân bằng tải, v.v.\"" }
        ]
      }
    ]
  };
} else { // loại rewrite 
  return {
    version: 1,
    sections: [
      {
        type: "group",
        title: "🫆 Rewrite 「Viết lại」",
        description: "Chỉ có hiệu lực với rewrite_remote / filter_remote",
        items: [
          { type: "tags", key: "in",  label: "Giữ lại phân luồng/viết lại「in」",
            description: "Giữ lại rewrite/filter theo từ khóa. Mỗi dòng một từ khóa (giữa các dòng là quan hệ \"hoặc\").",
            placeholder: "VD: weibo" },
          { type: "tags", key: "out",  label: "Vô hiệu hóa phân luồng/viết lại「out」",
            description: "Giữ lại rewrite/filter theo từ khóa. Mỗi dòng một từ khóa (giữa các dòng là quan hệ \"hoặc\").",
            placeholder: "VD: weibo" },
          { type: "tags", key: "inhn",  label: "Giữ lại hostname「inhn」",
            description: "Giữ lại hostname liên quan theo từ khóa. Mỗi dòng một từ khóa (giữa các dòng là quan hệ \"hoặc\").",
            placeholder: "VD: weibo" },
          { type: "tags", key: "outhn", label: "Xóa hostname「outhn」",
            description: "Xóa hostname liên quan theo từ khóa. Mỗi dòng một từ khóa (giữa các dòng là quan hệ \"hoặc\").",
            placeholder: "VD: tb_price" },
          { type: "text", key: "regex",   label: "Giữ lại theo regex「regex」",
            description: "Khớp regex để giữ lại nội dung chỉ định" },
          { type: "text", key: "regout",   label: "Xóa theo regex「regout」",
            description: "Khớp regex để xóa nội dung chỉ định" },
          { type: "text", key: "replace",   label: "Thay thế theo regex「replace」",
            description: "regex@new_regex thay thế bằng regex nội dung chỉ định" }
        ]
      },
      {
        type: "group",
        title: "🤖 Tham số khác",
        items: [
          { type: "select", key: "ntf",  label: "Thông báo phân tích",
            options: [
              { label: "Mặc định",          value: "" },
              { label: "Tắt",          value: "0"},
              { label: "Bật",          value: "1"}
            ] },
          { type: "select", key: "type", label: "Ép kiểu",
            options: [
              { label: "Tự động",         value: ""           },
              { label: "Nodes",        value: "nodes"      },
              { label: "Rule",         value: "rule"       },
              { label: "Module",       value: "module"     },
              { label: "List",         value: "list"       },
              { label: "Domain Set",   value: "domain-set" }
            ] },
          { type: "switch", key: "cdn",  label: "Tăng tốc GitHub CDN",
            onValue: "1", offValue: "" },
          { type: "select", key: "dst", label: "Mục tiêu chuyển đổi「dst」",
            options: [
              { label: "Mặc định (không chuyển đổi)", value: ""        },
              { label: "Rewrite",        value: "rewrite" },
              { label: "Filter",         value: "filter"  }
            ] }
        ]
      }
    ]
  };
}
};

// hashToUI: hỗ trợ tham số động
$parser.hashToUI = function (hash) {
  if (!hash) return { version: 1, sections: [] };

  var schema = $parser.hashSchema();
  var allItems = {};
  schema.sections.forEach(function (g) {
    g.items.forEach(function (it) { allItems[it.key] = it; });
  });

  var pairs = hash.split("&");
  var values = {};
  var dynamicItems = [];

  pairs.forEach(function (p) {
    if (!p) return;
    var eq = p.indexOf("=");
    var k = eq === -1 ? p : p.substring(0, eq);
    var v = eq === -1 ? "" : p.substring(eq + 1);

    if (allItems[k]) {
      values[k] = v;
    } else {
      dynamicItems.push({
        type: "text",
        key: k,
        label: k,
        value: v
      });
    }
  });

  var sections = [];

  schema.sections.forEach(function (g) {
    var items = [];
    g.items.forEach(function (it) {
      if (!(it.key in values)) return;

      var clone = JSON.parse(JSON.stringify(it));
      var raw = values[it.key];

      if (it.type === "switch") {
        clone.value = (raw === it.onValue);
      } else if (it.type === "tags") {
        clone.value = raw.split("+").filter(Boolean);
      } else {
        clone.value = raw;
      }

      items.push(clone);
    });

    if (items.length) {
      sections.push({
        type: "group",
        title: g.title,
        items: items
      });
    }
  });

  if (dynamicItems.length) {
    sections.push({
      type: "group",
      title: "Tham số tùy chỉnh",
      items: dynamicItems
    });
  }

  return {
    version: 1,
    sections: sections
  };
};


// uiToHash: hỗ trợ ghi lại trường động
$parser.uiToHash = function (values) {
  var schema = $parser.hashSchema();
  var allItems = {};
  schema.sections.forEach(function (g) {
    g.items.forEach(function (it) { allItems[it.key] = it; });
  });

  var parts = [];

  Object.keys(values).forEach(function (k) {
    var v = values[k];
    var meta = allItems[k];
    var serialized;

    if (meta) {
      if (meta.type === "switch") {
        serialized = v ? meta.onValue : meta.offValue;
      } else if (meta.type === "tags") {
        serialized = (v || []).join("+");
      } else {
        serialized = String(v);
      }
    } else {
      // Trường động mặc định là text
      serialized = String(v);
    }

    parts.push(k + "=" + serialized);
  });

  return parts.join("&");
};

// end ==== Parser Helper UI by Quantumult-X (918+) ====



//beginning Phần dùng bình thường của trình phân tích, khi debug hãy chú thích phần này


//
let version = typeof $environment != "undefined" ? Number($environment.version.split("build")[1]): 0 // Số phiên bản

const UA_Retry= "Shadowrocket/3218 CFNetwork/3860.600.12 Darwin/25.5.0 iPhone18,1"
const currentUA = $resource.user_agent;
const inRetry = currentUA && currentUA.length > 0;

const result = {
      // Normal parse result (kept for old-version compat;
      // new versions ignore this when retry fires)
      content: "",
      // or error: "..."
  };

//$notify("retry2","🚦 UA-retry-After-outside",currentUA)
//



let [link0, content0, subinfo] = [$resource.link, $resource.content, $resource.info]

let Perror = 0 // Loại lỗi


const ADDRes = `quantumult-x:///add-resource?remote-resource=url-encoded-json`
var RLink0 = {
  "filter_remote": [],
  "rewrite_remote": [],
  "server_remote": [],
}
const Field = {
  "filter" : "filter_remote",
  "rewrite": "rewrite_remote",
  "server" : "server_remote"
}  

const subtag = typeof $resource.tag != "undefined" ? $resource.tag : "";
////// Trường hợp link không phải raw kỳ lạ
content0 = content0.indexOf("DOCTYPE html") != -1 && link0.indexOf("github.com") != -1 && content0.split("\n").map(RuleNoteBody).join("\n").indexOf("DOCTYPE html") != -1 ? ToRaw(content0) : content0 ;
// Link plugin loon
content0 = link0.indexOf("nsloon.com/openloon/import?plugin=") != -1 ? ToLink(link0) : content0 ;
//ends Phần dùng bình thường, khi debug hãy chú thích phần này


// Hash của đường dẫn file khả dụng từ build 951; tham số dòng đầu local kiểu cũ phải bắt đầu bằng #key=, không được đọc # trong khối ghi chú.
var firstResourceLine = content0.split("\n")[0].trim();
var para = /^https?:\/\//.test(link0) || (version >= 951 && link0.indexOf("#") != -1) ? link0 :
  (/^#[ \t]*[a-z][\w-]*=/i.test(firstResourceLine) ? firstResourceLine : "");
var para1 = para.slice(para.indexOf("#") + 1).replace(/\$type/g,"node_type_para_prefix").replace(/\$emoji/g,"node_emoji_flag_prefix").replace(/\$tag/g,"node_tag_prefix").replace(/\$index/g,"node_index_prefix") // Ngăn các vị trí khác trong tham số cũng có "#"
var mark0 = para.indexOf("#") != -1 ? true : false; // Có tham số cần phân tích hay không
var UARetry = mark0 && /(?:^|&)UA=1(?:&|$)/.test(para1) ? 1 : 0;
var Pinfo = mark0 && para1.indexOf("info=") != -1 ? para1.split("info=")[1].split("&")[0] : 0;
var ntf_flow = 0;
// Các giá trị thường dùng
const Base64 = new Base64Code();
const escapeRegExp = str => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); // Xử lý ký tự đặc biệt để dùng khớp regex
var link1 = link0.split("#")[0]
const qxpng = "https://raw.githubusercontent.com/crossutility/Quantumult-X/master/quantumult-x.png" // server sub-info link
const subinfo_link = { "open-url": "https://t.me/QuanX_API", "media-url": "https://shrtm.nu/ebAr" };
const subinfo_link1 = { "open-url": link1, "media-url": "https://shrtm.nu/uo13" } // server sub-info link(fake-nodes)
const rwrite_link = { "open-url": link1, "media-url": "https://shrtm.nu/x3o2" } // rewrite filter link
const rwhost_link = { "open-url": link1, "media-url": "https://shrtm.nu/0n5J" } // hostname filter link
const rule_link = { "open-url": link1, "media-url": "https://shrtm.nu/cpHD" } // rule filter link
const nan_link = { "open-url": link1, "media-url": qxpng } // nan error link
const bug_link = { "open-url": "https://t.me/ShawnKOP_Parser_Bot", "media-url": "https://shrtm.nu/obcB" } // bug link
const sub_link = { "open-url": link1, "media-url": "https://shrtm.nu/ebAr" } // server link
const update_link = {"open-url" : "https://apps.apple.com/us/app/quantumult-x/id1443988620", "media-url": qxpng}
const plink0 = {"open-url" : link0, "media-url": qxpng} // Chuyển tới link subscription

if(version == 0) { $notify("⚠️ Hãy cập nhật Quantumult X lên phiên bản mới nhất trên cửa hàng\n","🚦 Phiên bản hiện tại có thể không dùng bình thường một số tính năng","\n👉 Nhấn để chuyển tới link cửa hàng cập nhật",update_link) }



SubFlow() // Thông báo lưu lượng


// Lấy tham số
var Pin0 = mark0 && para1.indexOf("in=") != -1 ? (para1.split("in=")[1].split("&")[0].split("+")).map(decodeURIComponent) : null;
var Pout0 = mark0 && (para.indexOf("#out=") != -1 || para.indexOf("&out=") != -1)? ((para.indexOf("#out=")!=-1? para.split("#out="): para.split("&out="))[1].split("&")[0].split("+")).map(decodeURIComponent) : null;
var Psfilter = mark0 && para1.indexOf("sfilter=") != -1 ? Base64.decode(para1.split("sfilter=")[1].split("&")[0]) : null; // script filter
var Preg = mark0 && para1.indexOf("regex=") != -1 ? decodeURIComponent(para1.split("regex=")[1].split("&")[0]).replace(/\，/g,",") : null; // Tham số lọc regex của server
var Pregout = mark0 && para1.indexOf("regout=") != -1 ? decodeURIComponent(para1.split("regout=")[1].split("&")[0]).replace(/\，/g,",") : null; // Tham số xóa regex của server
var Pregdel = mark0 && para1.indexOf("delreg=") != -1 ? decodeURIComponent(para1.split("delreg=")[1].split("&")[0]).replace(/\，/g,",") : null; // Tham số xóa regex
var Phin0 = mark0 && para1.indexOf("inhn=") != -1 ? (para1.split("inhn=")[1].split("&")[0].split("+")).map(decodeURIComponent) : null; //hostname 
var Phout0 = mark0 && para1.indexOf("outhn=") != -1 ? (para1.split("outhn=")[1].split("&")[0].split("+")).map(decodeURIComponent) : null; //hostname
var Preplace = mark0 && para1.indexOf("replace=") != -1 ? para1.split("replace=")[1].split("&")[0] : null; // Thay thế regex filter/rewrite
var Pemoji = mark0 && para1.indexOf("emoji=") != -1 ? para1.split("emoji=")[1].split("&")[0] : null;
var Pdbg = mark0 && para1.indexOf("dbg=") != -1 ? para1.split("dbg=")[1].split("&")[0] : null;
var Pudp0 = mark0 && para1.indexOf("udp=") != -1 ? para1.split("udp=")[1].split("&")[0] : 0;
var Ptfo0 = mark0 && para1.indexOf("tfo=") != -1 ? para1.split("tfo=")[1].split("&")[0] : 0;
//var Prname = mark0 && para1.indexOf("rename=") != -1 ? para1.split("rename=")[1].split("&")[0].split("+") : null;
var Prname = mark0 && /(^|\&)rename=/.test(para1) ? para1.split(/(^|\&)rename\=/)[2].split("&")[0].split("+") : null;
var Psrename = mark0 && para1.indexOf("srename=") != -1 ? Base64.decode(para1.split("srename=")[1].split("&")[0]) : null; // script rename
var Prrname = mark0 && para1.indexOf("rrname=") != -1 ? para1.split("rrname=")[1].split("&")[0].split("+") : null;
var Psuffix = mark0 && para1.indexOf("suffix=") != -1 ? para1.split("suffix=")[1].split("&")[0] : 0;
var Ppolicy = mark0 && para1.indexOf("policy=") != -1 ? decodeURIComponent(para1.split("policy=")[1].split("&")[0]) : "Shawn";
var Ppolicyset = mark0 && para1.indexOf("pset=") != -1 ? decodeURIComponent(para1.split("pset=")[1].split("&")[0]) : "";
var PcertMatch = mark0 ? para1.match(/(?:^|\&)(?:cert|tls-verification)=([^&]*)/) : null;
var Pcert0 = PcertMatch ? PcertMatch[1] : 0;
var Psort0 = mark0 && para1.indexOf("sort=") != -1 ? para1.split("sort=")[1].split("&")[0] : 0;
var PsortX = mark0 && para1.indexOf("sortx=") != -1 ? para1.split("sortx=")[1].split("&")[0] : 0;
var PTls13 = mark0 && para1.indexOf("tls13=") != -1 ? para1.split("tls13=")[1].split("&")[0] : 0;
var Pntf0 = mark0 && para1.indexOf("ntf=") != -1 ? para1.split("ntf=")[1].split("&")[0] : 2;
var Phide = mark0 && para1.indexOf("hide=") != -1 ? para1.split("hide=")[1].split("&")[0] : 1;
var Pb64 = mark0 && para1.indexOf("b64=") != -1 ? para1.split("b64=")[1].split("&")[0] : 0;
var emojino = ["0️⃣", "1⃣️", "2⃣️", "3⃣️", "4⃣️", "5⃣️", "6⃣️", "7⃣️", "8⃣️", "9⃣️", "🔟"]
var pfi = mark0 &&Pin0 ? "in=" + Pin0.join(", ") + ",  " : ""
var pfo = mark0 &&Pout0 ? "out=" + Pout0.join(", ") : ""
var pfihn = mark0 &&Phin0 ? "inhn=" + Phin0.join(", ") + ",  " : ""
var pfohn = mark0 &&Phout0 ? "outhn=" + Phout0.join(", ") : ""
var Pcnt =  mark0 &&para1.indexOf("cnt=") != -1 ? para1.split("cnt=")[1].split("&")[0] : 0;
var Pcap = mark0 &&para1.indexOf("cap=") != -1 ? para1.split("cap=")[1].split("&")[0] : "";
var Pptn = mark0 &&para1.indexOf("ptn=") != -1 ? para1.split("ptn=")[1].split("&")[0] : ""; // Ký tự tiếng Anh hoa văn
var Pnptn = mark0 &&para1.indexOf("npt=") != -1 ? para1.split("npt=")[1].split("&")[0] : ""; // Số hoa văn
var Pcdn = mark0 &&para1.indexOf("cdn=") != -1 ? para1.split("cdn=")[1].split("&")[0] : "";
let [flow, exptime, errornode, total] = "";
var Pdel = mark0 && para1.indexOf("del=") != -1 ? para1.split("del=")[1].split("&")[0] : 0; // Xóa node trùng lặp
var typeU = mark0 && para1.indexOf("type=") != -1 ? para1.split("type=")[1].split("&")[0] : "";
var Pfcr = mark0 && para1.indexOf("fcr=") != -1 ? para1.split("fcr=")[1].split("&")[0] : ""; // Tham số force-cellular, v.v.
var Pvia = mark0 && para1.indexOf("via=") != -1 ? para1.split("via=")[1].split("&")[0] : ""; // Tham số via-interface
var Paead = mark0 && para1.indexOf("aead=") != -1 ? para1.split("aead=")[1].split("&")[0] : ""; // Tham số aead của vmess
var Phost = mark0 && ( para.indexOf("#host=") != -1 || para.indexOf("&host=") != -1) ? (para.indexOf("#host=")!=-1? para.split("#host="): para.split("&host="))[1].split("&")[0] : ""; // Tham số obfuscation host
var Pcsha256 = mark0 && para1.indexOf("csha=") != -1 && version >= 646? para1.split("csha=")[1].split("&")[0] : ""; // Tham số obfuscation cert-sha256
var Ppsha256 = mark0 && para1.indexOf("psha=") != -1 && version >= 646? para1.split("psha=")[1].split("&")[0] : ""; // Tham số obfuscation pubkey-sha256
var typeQ = $resource.type? $resource.type:"unsupported"   // Trả về tham số loại field
var PRelay =mark0 && para1.indexOf("relay=") != -1 ? decodeURIComponent(para1.split("relay=")[1].split("&")[0]) : ""; // Tham số relay của node, dùng để thực hiện chức năng chuỗi proxy
var PUOT = mark0 && para1.indexOf("uot=") != -1 && version >= 665? para1.split("uot=")[1].split("&")[0] : ""; // Bật udp-over-tcp của node
var PcheckU = mark0 && para1.indexOf("checkurl=") != -1 ? decodeURIComponent(para1.split("checkurl=")[1].split("&")[0]) : ""; // Tham số server_check_url của node
typeQ = PRelay!=""? "server":typeQ
var typec="" //check result type
var Pflow=mark0 && para1.indexOf("flow=") != -1 ? para1.split("flow=")[1].split("&")[0] : 0; // Tham số thời gian lưu lượng, v.v.
var PProfile = mark0 && para1.indexOf("profile=") != -1 ? para1.split("profile=")[1].split("&")[0] : 0; // Tham số nhập cấu hình đầy đủ qua URL-Scheme
var Palpn = mark0 && para1.indexOf("alpn=") != -1 && version >= 712? para1.split("alpn=")[1].split("&")[0] : ""; // Loại over-tls, tham số alpn
var Pobfs = mark0 && para1.indexOf("obfs=") != -1 && version >= 770? para1.split("obfs=")[1].split("&")[0] : ""; // Chỉ định loại obfs=xx-http trong trường hợp đặc biệt
var Psession =  mark0 && para1.indexOf("tsession=") != -1 && version >= 771? para1.split("tsession=")[1].split("&")[0] : "";//tls-no-session-ticket and tls-no-session-reuse
// 0/1 nghĩa là tắt session-ticket/reuse, 2 nghĩa là tắt tất cả.
var Pmix = version>=844? 1 : 0 // allow rewrite and filter mix from version 844
var Pjsonjq = version>=845? 0 : 1 // allow jsonjq from version 845

// Ghi chú sửa tham số tls-verification ⟦2026-07-21 17:47:28 +08⟧
// Quantumult X build 938+ hỗ trợ tls-verification=domain; bản cũ vẫn chỉ xuất true/false, tránh client cũ đọc nhầm giá trị tên miền.
function TLSCertDomainValue(Pcert0) {
  var raw = Pcert0 === undefined || Pcert0 === null ? "" : String(Pcert0).trim();
  if (raw === "") return "";
  try { raw = decodeURIComponent(raw); } catch (e) {}
  raw = raw.trim();
  var low = raw.toLowerCase();
  if (low === "1" || low === "true") return "true";
  if (low === "-1" || low === "0" || low === "false") return "false";
  if (version >= 938 && /^(?=.{1,253}$)(?!-)(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z0-9-]{2,63}$/.test(raw)) {
    return raw;
  }
  return "";
}

function TLSCertParam(Pcert0, fallback) {
  var cert = TLSCertDomainValue(Pcert0);
  var value = cert !== "" ? cert : fallback;
  return value === "" || value === undefined || value === null ? "" : "tls-verification=" + value;
}

var PNS=0 // Thống kê node không được hỗ trợ
var NSList=["Trong subscription hiện tại, các node sau không được hỗ trợ ↘️ \n"] // Danh sách node không được hỗ trợ

var RegoutList= [] ;// Dùng để nhắc sàng lọc tham số regout
// URL-Scheme thêm cấu hình
var ADDres = `quantumult-x:///add-resource?remote-resource=url-encoded-json`
var RLink = `{
  "server_remote": [
    sremoteposition
  ],
  "filter_remote": [
    fremoteposition
  ],
  "rewrite_remote": [
    rremoteposition
  ]
}`

var ProfileInfo = {
  "server":"",
  "filter":"",
  "rewrite":""
}

function VCheck(cnt) {
  cnts=cnt.split("\n").filter(Boolean).map(item=>item.trim()).filter(item => /^http/.test(item)).map(item=>"\""+item+"\"")
  cnts=cnts.join(",\n")
  //console.log(cnts)
  return  cnts
  }

function Profile_Handle() {
  let a = content0
  PProfile= PProfile==1? "001":PProfile
  PProfile= PProfile==8? "010": PProfile
  PProfile= PProfile==9? "011": PProfile
  srm = a.split("[server_remote]")[1] && String(PProfile)[0]=="1"? VCheck(a.split("[server_remote]")[1].split("[")[0]) : ""
  frm = a.split("[filter_remote]")[1] && String(PProfile)[1]=="1"? VCheck(a.split("[filter_remote]")[1].split("[")[0]) : ""
  rrm = a.split("[rewrite_remote]")[1] && String(PProfile)[2]=="1"? VCheck(a.split("[rewrite_remote]")[1].split("[")[0]) : ""
  RLink=RLink.replace("sremoteposition",srm).replace("fremoteposition",frm).replace("rremoteposition",rrm)
  ADDres=ADDres.replace("url-encoded-json",encodeURIComponent(RLink))
}

//
// Thông tin lưu lượng
//{bytes_used: 1073741824, bytes_remaining: 2147483648, expire_date: 1653193966}}
var Finfo={}
if (Pflow!=0) {
  Pflow = Pflow.split(":")
  var Bdate=Date.parse(new Date(Pflow[0]))/1000
  var Btotal=Pflow[1]? Pflow[1]*1024*1024*1024 : 0
  var Bused=Pflow[2]? Pflow[2]*1024*1024*1024 : 0
  var Bremain=Btotal !=0 ? Btotal-Bused : 1
  var BJson={bytes_used: Bused, bytes_remaining: Bremain, expire_date: Bdate}
  //$notify("Flow","",JSON.strigify(BJson))
  Finfo = BJson
}

//STATUS=🚀↑:0.62GB,↓:15.1GB,TOT:200GB💡Expires:2026-08-02
//status=🚀↑:0.83gb,↓:17.73gb,tot:200gb💡expires:2026-08-02
//2026-05-06 for shadowrocket sub with flow-info-fake server
function Rocket_flow(RInfo) {
  var Rinfo=RInfo.replace(/ /g, "").toLowerCase()
  var BJson={}
  try {
    var Pdate = Rinfo.split("expires:")[1].split(",")[0].replace(/[^\x00-\x7F]/g, '').trim()// date-time
    var Ptotal = Number(Rinfo.split("tot:")[1].split("gb")[0]) // flow
    var Pupload = Number(Rinfo.split("↑:")[1].split("gb")[0]) // upload
    var Pdown = Number(Rinfo.split("↓:")[1].split("gb")[0]) // download
    var Bdate = Math.floor(Date.parse(Pdate)/1000)? Math.floor(Date.parse(Pdate)/1000): Math.floor(Date.parse("2046-10-10")/1000) 
    var Btotal=Ptotal? Ptotal*1024*1024*1024 : 0
    var Bused=Pupload? (Pupload+Pdown)*1024*1024*1024 : 0
    var Bremain=Btotal !=0 ? Btotal-Bused : 1
    BJson={bytes_used: Bused, bytes_remaining: Bremain, expire_date: Bdate}
    Finfo = BJson
  } catch (error) {
    console.log(error)
  }
}

// Pattern chữ hoa văn
var pat=[]
pat[0] = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","k","r","s","t","u","v","w","x","y","z"]
pat[1] = ["🅰","🅱","🅲","🅳","🅴","🅵","🅶","🅷","🅸","🅹","🅺","🅻","🅼","🅽","🅾","🅿","🅺","🆁","🆂","🆃","🆄","🆅","🆆","🆇","🆈","🆉"]
pat[2] = ["🄰","🄱","🄲","🄳","🄴","🄵","🄶","🄷","🄸","🄹","🄺","🄻","🄼","🄽","🄾","🄿","🄺","🅁","🅂","🅃","🅄","🅅","🅆","🅇","🅈","🅉"]
pat[3] = ["𝐀","𝐁","𝐂","𝐃","𝐄","𝐅","𝐆","𝐇","𝐈","𝐉","𝐊","𝐋","𝐌","𝐍","𝐎","𝐏","𝐊","𝐑","𝐒","𝐓","𝐔","𝐕","𝐖","𝐗","𝐘","𝐙"]
pat[4] = ["𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","i","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗸","𝗿","𝘀","𝐭","𝘂","𝘃","𝘄","𝘅","𝘆","𝘇"]
pat[5] = ["𝔸","𝔹","ℂ","𝔻","𝔼","𝔽","𝔾","ℍ","𝕀","𝕁","𝕂","𝕃","𝕄","ℕ","𝕆","ℙ","𝕂","ℝ","𝕊","𝕋","𝕌","𝕍","𝕎","𝕏","𝕐","ℤ"]
pat[6] = ["𝕒","𝕓","𝕔","𝕕","𝕖","𝕗","𝕘","𝕙","𝕚","𝕛","𝕜","𝕝","𝕞","𝕟","𝕠","𝕡","𝕜","𝕣","𝕤","𝕥","𝕦","𝕧","𝕨","𝕩","𝕪","𝕫"]
pat[7] = ["ᵃ","ᵇ","ᶜ","ᵈ","ᵉ","ᶠ","ᵍ","ʰ","ⁱ","ʲ","ᵏ","ˡ","ᵐ","ⁿ","ᵒ","ᵖ","ᵒ⃒","ʳ","ˢ","ᵗ","ᵘ","ᵛ","ʷ","ˣ","ʸ","ᙆ"]
pat[8] = ["ᴬ","ᴮ","ᒼ","ᴰ","ᴱ","ᶠ","ᴳ","ᴴ","ᴵ","ᴶ","ᴷ","ᴸ","ᴹ","ᴺ","ᴼ","ᴾ","ᴼ̴","ᴿ","ˢ","ᵀ","ᵁ","ᵛ","ᵂ","ˣ","ʸ","ᙆ"]

// Số hoa văn
var patn=[]
patn[0] = ["0","1","2","3","4","5","6","7","8","9"]
patn[1] = [ '⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨' ]
patn[2] = [ '⓪', '❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾' ]
patn[3] = [ '⓪', '⓵', '⓶', '⓷', '⓸', '⓹', '⓺', '⓼', '⓻', '⓽' ]
patn[4] = [ '𝟘', '𝟙', '𝟚', '𝟛', '𝟜', '𝟝', '𝟞', '𝟟', '𝟠', '𝟡' ]
patn[5] = [ '⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹' ]
patn[6] = [ '₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉' ]
patn[7] = ["𝟎","𝟏","𝟐","𝟑","𝟒","𝟓","𝟔","𝟳","𝟖","𝟗"]
patn[8] = ["𝟶","𝟷","𝟸","𝟹","𝟺","𝟻","𝟼","𝟽","𝟾","𝟿"]


// Thay số thành số emoji, xử lý phiên bản đặc biệt của 10 (cần "🔟"), 2026-04-22
function numToEmoji10(n) {
    if (n == 10) {
      return emojino[10]+" ➠ ";
    } else {
      return String(n).split('').map(d => emojino[d] || d).join('')+" ➠ ";
    }
};


// Hàm tránh lỗi json undefined
const getValue = (fn, defaultVaule) => {
  try {
    return fn();
  } catch (error) {
    return defaultVaule;
  }
};

var type0=""
// flag=1,2,3 lần lượt là loại server, rewrite, rule
var flag = 1
var subscriptionURL = SubscriptionURL(content0)

// Mã QR subscription dẫn thêm tài nguyên trước, tham số # của URL để lại cho việc phân tích subscription sau khi thêm.
if (subscriptionURL) {
  type0 = "sub-http"
  $done({content: ResourceParse()})
// retry with new UA, default use shadowrocket
} else if (UARetry && !inRetry && version>920) {
  $done({retry: {user_agent: "Shadowrocket/3218 CFNetwork/3860.600.12 Darwin/25.5.0 iPhone18,1"}})
} else {
  if (typeof($resource)!=="undefined" && PProfile == 0) {
  Parser()
  $done({ content: total, info: Finfo })
} else if (PProfile != 0) {
  try {
    Profile_Handle()
  } catch (err) {
    if(Perror == 0) {
      $notify("❌ Xuất hiện lỗi phân tích", "⚠️ Hãy nhấn thông báo, gửi link subscription để phản hồi", err, bug_link);
    }
    }
  openlink = {"open-url": ADDres}
  $notify("⚠️Hãy bỏ qua nhắc báo lỗi, nhấn thông báo này để chuyển", "Thêm tài nguyên từ xa hợp lệ trong cấu hình👇 ["+ PProfile+"]", ADDres,openlink)
  total = ProfileInfo[typeQ]
  $done({content:total})
}
}

function Parser() {
  type0 = Type_Check(content0); // Xác định loại
  //$notify(type0)
  if (type0 != "web" && type0 != "wrong-field" && type0 != "JS-0" && type0 != "wrong-link"){
    try {
      //$notify(type0,"hh")
      if (Pdbg){
        $notify(link0,type0,content0)
      }
      total = ResourceParse();
      
    } catch (err) {
      if(Perror == 0) {
      $notify("❌ Xuất hiện lỗi phân tích", "⚠️ Hãy nhấn thông báo, gửi link subscription để phản hồi", err, bug_link);
    }
    }
  } else if (type0 == "wrong-field"){
    if (version >= 670 && typec!="") { // Thử chuyển tới loại đúng
      RLink0[Field[typec]].push($resource.link+", opt-parser=true, tag=Lần sau thêm tài nguyên🉑️nhấn giữ❤️8⃣️") // Chuyển URI-Scheme
      var flink = ADDRes.replace(/url-encoded-json/,encodeURIComponent(JSON.stringify(RLink0)))
      const bug_linkx = { "open-url": flink, "media-url": "https://shrtm.nu/obcB" } // bug linkx
    $notify( "⚠️ Hãy nhấn thông báo để chuyển thử thêm vào loại đúng","❌ Loại phát hiện["+typec+"]"+" xung đột với loại đã nhập"+"["+typeQ+"]", "Nếu chuyển thêm vẫn thất bại, hãy gửi link phản hồi cho bot trình phân tích\n"+$resource.link, bug_linkx)
    } else {// Phiên bản cũ
    $notify("❌ Loại phát hiện「"+typec+" 」"+" xung đột với loại đích"+" 「"+typeQ+" 」", "⚠️ Hãy tự kiểm tra nội dung link, hoặc nhấn thông báo để gửi link phản hồi", $resource.link, bug_link)
    }
    total=""
  } else {
    total=""
  }
    $done({ content: total });
}


// 2026-05-15 remove
// if (typeof($resource)!=="undefined" && PProfile == 0) {
//   Parser()
//   $done({ content: total, info: Finfo })
// } else if (PProfile != 0) {
//   try {
//     Profile_Handle()
//   } catch (err) {
//     if(Perror == 0) {
//       $notify("❌ Xuất hiện lỗi phân tích", "⚠️ Hãy nhấn thông báo, gửi link subscription để phản hồi", err, bug_link);
//     }
//     }
//   openlink = {"open-url": ADDres}
//   $notify("⚠️Hãy bỏ qua nhắc báo lỗi, nhấn thông báo này để chuyển", "Thêm tài nguyên từ xa hợp lệ trong cấu hình👇 ["+ PProfile+"]", ADDres,openlink)
//   total = ProfileInfo[typeQ]
//   $done({content:total})
// }


/**
# Dưới đây là các function cụ thể

*/

function ParseUnknown(cnt){
  try {
    cnt = JSON.parse(cnt)
    if(cnt) {
      $notify("⚠️ Nội dung link trả về không phải subscription hợp lệ"+ "⟦" + subtag + "⟧","⁉️ Hãy tự kiểm tra link gốc, nội dung trả về 👇️👇️",JSON.stringify(cnt), bug_link)
    }
    
  } catch(err) {
    if (!/error|block|invalid|support/.test(cnt.toLowerCase())) {
    $notify("😭 Không nhận diện được nội dung subscription " + "⟦" + subtag + "⟧",  "⚠️ Sẽ thử nhập trực tiếp vào Quantumult X \n Nếu cho là BUG, hãy nhấn thông báo để chuyển và [gửi link] phản hồi", "Nội dung subscription trả về: 👇 \n"+cnt, bug_link);
  } else {
    $notify("💢 ⟦" + subtag + "⟧ Nội dung trả về không hợp lệ",  "😠 Hãy tự kiểm tra subscription, đừng chạy tới phản hồi", "Nội dung subscription trả về: 👇 \n"+cnt, plink0);
  }
}
}


function ResourceParse() {
  var rewriteFailures = [];
  // Tiền xử lý, đã xử lý xong phân luồng/viết lại, v.v.
  if (type0 == "Subs-B64Encode") { // subs2QX phụ trách chuyển đổi tất cả node
    if (Pdbg) {$notify("original content", "node-b64", content0)}
    total = Subs2QX(Base64.decode(content0), Pudp0, Ptfo0, Pcert0, PTls13);
  } else if (type0 == "Subs") {
    //$notify("subs","",content0+Pudp0+Ptfo0+Pcert0+PTls13)
    total = Subs2QX(content0, Pudp0, Ptfo0, Pcert0, PTls13);
  } else if (type0 == "QuanX" || type0 == "Clash" || type0 == "Surge") {
    total = Subs2QX(isQuanX(content0).join("\n"), Pudp0, Ptfo0, Pcert0, PTls13);
  } else if (type0 == "sgmodule") { // surge module module/chứa url-regex của rule-set
    //2023-03-06 Xem xét việc trộn viết lại của module với viết lại kiểu quanx
    flag = 2 
    //total = SGMD2QX(content0) // Chuyển đổi 
    total = Rewrite_Filter(isQuanXRewrite(content0.split("\n"), rewriteFailures), Pin0, Pout0,Preg,Pregout, rewriteFailures.length > 0);// Sàng lọc
    if (Preplace) { total = ReplaceReg(total, Preplace) }
    total = total.filter( (ele,pos)=>total.indexOf(ele) == pos); // Kiểm tra trùng lặp viết lại
    if (Pcdn) {total = CDN(total)
    } else { total = total.join("\n")}
  } else if (type0 == "rewrite") { // Loại rewrite
    flag = 2;
    total = Rewrite_Filter(isQuanXRewrite(content0.split("\n"), rewriteFailures), Pin0, Pout0,Preg,Pregout, rewriteFailures.length > 0);
    if (Preplace) { total = ReplaceReg(total, Preplace) }
    // Kiểm tra trùng lặp rewrite
    total = total.filter( (ele,pos)=>total.indexOf(ele) == pos);
    if (Pcdn) {total = CDN(total)
    } else {total = total.join("\n")}
  } else if (type0 == "Rule") {  // Loại rule, đã xử lý xong
    flag = 3;
    total = Rule_Handle(content0.split("\n").map(item=>item.trim()).filter(Boolean), Pout0, Pin0).filter(Boolean);
    if (Preg && total.length!=0) { // Lọc rule bằng regex filter
    total = total.map(Regex).filter(Boolean) 
    RegCheck(total, "Tham chiếu phân luồng", "regex", Preg)
  } 
    if (Pregout && total.length!=0) { // Xóa rule bằng regex filter
    total = total.map(RegexOut).filter(Boolean)
    RegCheck(total, "Tham chiếu phân luồng", "regout", Pregout)
  }
    if (Preplace) { total = ReplaceReg(total, Preplace) }
    if (Ppolicyset) {total = policy_sets(total, Ppolicyset)}
      // Kiểm tra trùng lặp filter
    total = total.length<100? total.filter( (ele,pos)=>total.indexOf(ele) == pos) : total
    total = total.join("\n")
  } else if (content0.trim() == "") {
    $notify("‼️ Tham chiếu hiện tại" + "⟦" + subtag + "⟧" + " trả về nội dung trống", "1️⃣ Hãy xác nhận APP đã cập nhật lên phiên bản mới nhất 1.5.6", "2️⃣ Nếu xác nhận link hợp lệ, hãy mở tùy chọn「Thay thế User-Agent」của trình phân tích tài nguyên để lấy lại nội dung link ", nan_link);
    flag = 0;
  } else if (type0 == "sub-http") {
    let url = subscriptionURL
    if (version && version < 670) {
      $notify("⚠️ Link nghi là subscription node", "Hãy thêm subscription trong tài nguyên node", "Phiên bản hiện tại không hỗ trợ nhấn thông báo để thêm tài nguyên, hãy cập nhật Quantumult X rồi thử lại.")
    } else {
      let resource = {server_remote: [url.replace(/,/g, "%2C") + ", opt-parser=true, tag=Quét mã subscription-" + Date.now()]}
      let addURL = ADDRes.replace("url-encoded-json", encodeURIComponent(JSON.stringify(resource)))
      $notify("⚠️ Link nghi là subscription node", "Hãy nhấn thông báo này để chuyển sang thêm subscription node", "Nội dung này nên được thêm qua tài nguyên node; hãy xác nhận địa chỉ subscription ở trang thêm.", {"open-url": addURL})
    }
    return "" // Đã dẫn thêm subscription, không vào fallback URI gốc của flag=-1 nữa.
  } else if (type0 == "unknown") {
    ParseUnknown(content0)
    flag = -1;
  } else if (type0 == "profile") {
    PProfile = "111" // Mặc định thêm tất cả các phần
    Profile_Handle()
    openlink = {"open-url": ADDres}
    $notify("⚠️ Link này là file cấu hình đầy đủ, hãy nhấn thông báo này để chuyển", "Thêm tài nguyên từ xa hợp lệ trong cấu hình👇 ["+ PProfile+"]", ADDres, openlink)
    flag = -1;
    total = ""
  } else if (type0 == "JS-0") {
    total = ""
  }

  // Bắt đầu xử lý
  if (flag == 1) { // Xử lý thống nhất loại server
    total = isQuanX(total.filter(Boolean).join("\n"))
    if (Pinfo == 1 && ntf_flow == 0) { // Thông báo lưu lượng kiểu node giả
      flowcheck(total)
    }
    if (Pin0 || Pout0) { total = Filter(total, Pin0, Pout0) } // in & out 
    if (Preg) { total = total.map(Regex).filter(Boolean)  // regex
      RegCheck(total, "Subscription node", "regex", Preg)} 
    if (Pregout) { total = total.map(RegexOut).filter(Boolean)  // regex out
      RegCheck(total, "Subscription node", "regout", Pregout)} 
    if (Psfilter) { total = FilterScript(total, Psfilter) }
    if (Prrname) {
      Prn = Prrname;
      total = total.map(Rename);
    }
    //if (Pemoji) { total = emoji_handle(total, Pemoji); }
    if (Pregdel) {
      delreg = Pregdel
      total = total.map(DelReg)
    }
    // script rename đặt trước các tham số khác
    if (Psrename) { total = RenameScript(total, Psrename) }
    if (Preplace) { // Loại server cũng có thể dùng tham số replace để đổi tên
      total = ReplaceReg(total, Preplace)
    }
    if (Prname) {
      Prn = Prname;
      total = total.map(Rename);
      if(Pdbg==1) {$notify("rename","content",total)}
    }
    // 2023-07-10 Điều chỉnh thứ tự thao tác emoji
    if (Pemoji) { total = emoji_handle(total, Pemoji); }
    if (total.length > 0){
      if (Psuffix==1 || Psuffix==-1) {total = Psuffix == 1? total.map(type_suffix):total.map(type_prefix)
      }
      total = total.map(type_handle).map(emoji_prefix_handle).map(tag_handle) // Các thao tác tên node các loại
      if (Psort0) { // Thao tác sắp xếp
        total = QXSort(total, Psort0);
      }
      total = para1.indexOf("node_index_prefix")!=-1 ?index_handle(total):total // Thao tác số thứ tự node
      //$notify("before","haha",total)
      total = TagCheck_QX(total).join("\n") // Kiểm tra tên node
      if (PUOT==1) { total = total.split("\n").map(UOT).join("\n")}
      if (Pcnt == 1 && total!=undefined) {$notify("⟦" + subtag + "⟧"+"Nội dung trả về cuối cùng sau phân tích" , "Số lượng node: " +total.split("\n").length, total)}
      total = PRelay==""? Base64.encode(total) : ServerRelay(total.split("\n"),PRelay) // Ép loại node mã hóa base64 rồi mới nhập vào Quantumult X, nếu là relay thì chuyển thành loại phân luồng
      if (PNS !=0) {
        if (version >913) {
        } else {
        }
      }
      if(Pflow==1) {
        //$notify("Thêm thông tin lưu lượng","xxx","xxxx")
        $done({ content: total, info: {bytes_used: 3073741824, bytes_remaining: 2147483648, expire_date: 1854193966}});
      //$notify("done?","strange")
      } else { $done({ content: total });}
    } else { // total length = 0
      if(Perror == 0) {
      if (PNS !=0) { // Tất cả đều là node loại không được hỗ trợ
        if (version >913) {
        } else {
        }
        
      } else { // Nguyên nhân khác
        $notify("❓❓ Subscription này ➟ "+ "⟦" + subtag + "⟧ sau phân tích không có node hợp lệ", "⚠️⚠️ Sau phân tích số node Quantumult-X hỗ trợ là 0️⃣ node", "🚥🚥 Hãy tự kiểm tra tham số liên quan, xác nhận loại node, hoặc nhấn thông báo để chuyển và gửi link phản hồi", bug_link)
      } 
    }
      total = errornode
      $done({ content: errornode })
    }
  } else if (flag == 0){ // Loại trống/lỗi
    total = errornode
    $done({ content: errornode })
  } else if (flag == -1){ // Loại không xác định
    total = typeQ == "filter" || typeQ == "rewrite" ? content0.split("\n").map(RuleNoteOutput).join("\n") : content0
    $done({ content: total })
  } 
  // Ghi chú đi cùng rule hoàn thành chuyển đổi và sàng lọc trước, chỉ hạ cấp khi xuất tới client không hỗ trợ ghi chú, tránh mất ghi chú hoặc lệch dòng.
  if (flag == 2 || flag == 3) { total = total.split("\n").map(RuleNoteOutput).join("\n") }
  if (Pcnt == 1 && flag !=1 && total!=undefined) {$notify("Nội dung trả về cuối cùng sau phân tích" , "Tổng số lượng: " +total.split("\n").length, total)}
  return total
  
}

// Phần xử lý lưu lượng header phản hồi
function SubFlow() {
  if (Pinfo == 1 && subinfo) {
    var sinfo = subinfo.replace(/ /g, "").toLowerCase();
    var total = "Tổng lưu lượng: " + (parseFloat(sinfo.split("total=")[1].split(",")[0]) / (1024 ** 3)).toFixed(2) + "GB";
    var usd = "Đã dùng lưu lượng: " + ((parseFloat(sinfo.indexOf("upload")!=-1?sinfo.split("upload=")[1].split(",")[0]:"0") + parseFloat(sinfo.split("download=")[1].split(",")[0])) / (1024 ** 3)).toFixed(2) + "GB"
    var left = "Còn lại lưu lượng: " + ((parseFloat(sinfo.split("total=")[1].split(",")[0]) / (1024 ** 3)) - ((parseFloat(sinfo.indexOf("upload")!=-1?sinfo.split("upload=")[1].split(",")[0]:"0") + parseFloat(sinfo.split("download=")[1].split(",")[0])) / (1024 ** 3))).toFixed(2) + "GB"
    if (sinfo.indexOf("expire=") != -1) {
      var epr = new Date(parseFloat(sinfo.split("expire=")[1].split(",")[0]) * 1000);
      var year = epr.getFullYear();  // Lấy năm đầy đủ (4 chữ số, 1970)
      var mth = epr.getMonth() + 1 < 10 ? '0' + (epr.getMonth() + 1) : (epr.getMonth() + 1);  // Lấy tháng (0-11, 0 nghĩa là tháng 1, khi dùng nhớ cộng 1)
      var day = epr.getDate() < 10 ? "0" + (epr.getDate()) : epr.getDate();
      epr = "Thời gian hết hạn: " + year + "-" + mth + "-" + day
    } else {
      epr = ""; //"Thời gian hết hạn: ✈️ Không cung cấp thông tin này" // Không có thời gian hết hạn thì hiển thị link subscription
    }
    var message = total + "\n" + usd + ", " + left;
    ntf_flow = 1;
    $notify("Thông tin lưu lượng: ⟦" + subtag + "⟧", epr, message, subinfo_link)
  }
//  } else if (Pinfo ==1){
//    $notify("Thông tin lưu lượng: ⟦" + subtag + "⟧", "", "⚠️ Link subscription này không trả về bất kỳ thông tin lưu lượng nào", subinfo_link)
//  }
}

//flowcheck-fake-server
function flowcheck(cnt) {
    for (var i = 0; i < cnt.length; i++) {
        var item = cnt[i];
        var nl = item.slice(item.indexOf("tag"))
        var nm = nl.slice(nl.indexOf("=") + 1)
        if (item.indexOf("剩余流量") != -1) {
            flow = nm
        } else if (item.indexOf("期时间") != -1) {
            exptime = nm
        }
    }
  flow = flow? flow:"⚠️ Subscription này không trả về bất kỳ thông tin lưu lượng nào"
  exptime = exptime? exptime:"⚠️ Subscription này không trả về thông tin thời gian gói"
    if (flow != "") { $notify("Thông tin lưu lượng: ⟦" + subtag + "⟧", flow, exptime, subinfo_link1) }
}

// Kiểm tra sau regex
function RegCheck(total, typen, paraname,regpara) {
  if(total.length == 0){ 
    $notify("‼️ " + typen + "  ➟ " + "⟦" + subtag + "⟧", "⛔️ Regex sàng lọc: " + paraname + "=" + regpara, "⚠️ Sau sàng lọc còn lại 0️⃣ mục, hãy kiểm tra tham số regex và link gốc", nan_link)
  }else if((typen != "Subscription node" && Pntf0 !=0) || (typen == "Subscription node" && Pntf0 ==1)){
    var nolist = total.length <= 10 ? emojino[total.length] : total.length
    $notify("🤖 " + typen + "  ➟ " + "⟦" + subtag + "⟧", "⛔️ Regex sàng lọc: " + paraname + "=" + regpara, "⚠️ Sau sàng lọc còn lại các mục khớp sau" + nolist + " mục khớp \n ⨷ " + total.join("\n ⨷ "), sub_link)
  }
}
// Ghi chú đầu dòng chỉ giữ làm metadata; không qua dòng, không quét nội dung chính, khi chuyển đổi thất bại không để lại ghi chú mồ côi.
function RuleNoteSplit(row) {
  var match = row.match(/^([ \t]*\{#[^\r\n]*?#\}[ \t]*)([^\r\n]*)\r?$/);
  return match ? { note: match[1], body: match[2] } : { note: "", body: row };
}

function RuleNoteBody(row) {
  return RuleNoteSplit(row).body;
}

function RuleNoteJoin(note, body) {
  return body && body.trim() && body.trim() != "-" ? note + body : "";
}

function RuleNoteMap(row, transform) {
  var parts = RuleNoteSplit(row);
  return RuleNoteJoin(parts.note, transform(parts.body));
}

function RuleNoteOutput(row) {
  var parts = RuleNoteSplit(row);
  if (parts.note) { return RuleNoteJoin(version >= 950 ? parts.note : "", parts.body) }
  return /^[ \t]*\{#/.test(row) ? "" : row; // Ghi chú chưa đóng cũng không được xuất qua fallback loại không xác định.
}

// Xác định loại subscription
// Quét mã có thể truyền vào URL subscription; chỉ nhận diện link đơn lẻ, có đặc trưng subscription, không yêu cầu nội dung của nó.
function SubscriptionURL(content) {
    if (!/^(server|uri|unsupported)$/i.test(typeQ)) { return "" }
    var url = content.trim()
    var wrapped = /^subs?:\/\//i.test(url)
    if (wrapped) {
      var encoded = url.replace(/^subs?:\/\//i, "").split("#")[0]
      if (!/^[a-z0-9+/_-]+={0,2}$/i.test(encoded)) { return "" }
      url = Base64.decode(encoded.replace(/-/g, "+").replace(/_/g, "/")).trim()
    }
    if (/[\s\x00-\x1f\x7f<>"\\]/.test(url)) { return "" }
    var parts = /^https?:\/\/([^/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i.exec(url)
    if (!parts) { return "" }
    // user:pass@host và đoạn host Base64 thuộc về URI node HTTP(S), không được đổi thành subscription。
    if (!/^(?:[a-z0-9-]+(?:\.[a-z0-9-]+)+|\[[a-f0-9:.]+\])(?::\d{1,5})?$/i.test(parts[1])) { return "" }
    var path = parts[2] || "", query = parts[3] || ""
    var subscriptionPath = /(?:^|\/)(?:sub|subscribe|subscription|link)(?:[/.]|$)/i.test(path)
    var resourceFile = /\.(?:txt|list|yaml|yml|conf|json|snippet)$/i.test(path)
    var tokenPath = path.split("/").some(function (part) { return /^[a-z0-9_-]{16,}$/i.test(part) && /[a-z]/i.test(part) && /\d/.test(part) })
    var subscriptionQuery = /[?&](?:token|access_token|subscription|subscribe|sub|target)=[^&#]+/i.test(query) || /[?&](?:type|flag|format)=(?:quanx|quantumultx?|clash|surge|v2ray|sing-?box)(?:&|$)/i.test(query)
    return wrapped || subscriptionPath || resourceFile || tokenPath || subscriptionQuery ? url : ""
}

function Type_Check(subs) {
    // Nhận dạng loại dùng bản sao nội dung; content0 giữ ghi chú gốc để chuyển đổi từng dòng.
    if (typeQ != "server" && typeQ != "uri" && subs.indexOf("{#") != -1) { subs = subs.split("\n").map(RuleNoteBody).join("\n") }
    var type = "unknown"
    var RuleK = ["host,", "-suffix,", "domain,", "domain-regex,", "-keyword,", "ip-cidr,", "ip-cidr6,",  "geoip,", "user-agent,", "ip6-cidr,", "ip-asn", "and,", "or,", "not,"];
    var DomainK = ["domain-set,"]
    var QuanXK = ["shadowsocks=", "trojan=", "vmess=", "http=", "socks5=", "vless=","anytls="];
    var SurgeK = ["=ss,", "=vmess,", "=trojan,", "=http,", "=custom,", "=https,", "=shadowsocks", "=shadowsocksr", "=sock5", "=sock5-tls","=anytls"];
    var ClashK = ["proxies:","\"proxies\":"]
    var SubK = ["dm1lc3M", "c3NyOi8v", "CnNzOi8", "dHJvamFu", "c3M6Ly", "c3NkOi8v", "c2hhZG93", "aHR0cDovLw", "aHR0cHM6L", "CnRyb2phbjo", "aHR0cD0", "aHR0cCA","U1RBVFVT","dmxlc3M6"];
    var RewriteK = [" url 302", " url 307", " url reject", " url script", " url req", " url res", " url echo", " url-and-header 302", " url-and-header 307", " url-and-header reject", " url-and-header script", " url-and-header req", " url-and-header res", " url-and-header echo", " url jsonjq"] // rewrite loại Quantumult X
    var JsonJQK = [" response-body-json-jq ", " request-body-json-jq ", " response-body-json-del ", " response-body-json-replace ", " http-response-jq ", " http-request-jq "] // Cần chuyển thành rewrite jsonjq của QuanX
    // ⟦2026-09-18 14:27 +08⟧ Cả hai tiền tố URI Hysteria2 đi vào xử lý node, nhánh không hỗ trợ sẽ nhắc chung, tránh đi nhầm nhánh không xác định/Base64.
    var SubK2 = ["ss://", "vmess://", "ssr://", "trojan://", "ssd://", "\nhttps://", "\nhttp://","socks://","ssocks://","vless://","anytls://","wireguard://","wg://","tuic://","hysteria2://","hy2://"];
    var ModuleK = ["[Script]", "[Rule]", "[URL Rewrite]", "[Body Rewrite]", "[Map Local]", "\nhttp-r", "script-path"]
    var QXProfile = ["[filter_local]","[filter_remote]","[server_local]","[server_remote]"]
    var html = "DOCTYPE html"
    var subi = subs.replace(/ /g, "")
    const RuleCheck = (item) => subi.toLowerCase().indexOf(item) != -1;
    const NodeCheck = (item) => subi.toLowerCase().indexOf(item.toLowerCase()) != -1;
    const NodeCheck1 = (item) => subi.toLowerCase().indexOf(item.toLowerCase()) != -1; //loại subscription mã hoá b64
    const NodeCheck2 = (item) => subi.toLowerCase().indexOf(item.toLowerCase()) != -1; //loại URI
    const RewriteCheck = (item) => subs.indexOf(item) != -1 ; // nhận định rewrite của QuanX
    const JsonJQCheck = (item) => (" " + subs.toLowerCase().replace(/\s+/g," ") + " ").indexOf(item) != -1;
    const ProfileCheck = (item) => subs.indexOf(item) != -1; //có phải file cấu hình QuanX hay không
    var subsn = subs.split("\n")
    if ( (subs.indexOf(html) != -1 || subs.indexOf("doctype html") != -1) && link0.indexOf("github.com" == -1)) {
      $notify("‼️ Liên kết này trả về nội dung trang web không hợp lệ"+ " ➟ " + "⟦" + subtag + "⟧", "⁉️ Nhấn vào thông báo để kiểm tra xem liên kết có hết hiệu lực không\n"+link0, "Nội dung trả về như sau⬇️:\n"+subs, nan_link);
      type = "web";
    } else if (typeU == "nodes" && typeQ=="server") { //chỉ định là loại node
      type = (typeQ == "unsupported" || typeQ =="server")? "Subs":"wrong-field"
    } else if (ClashK.some(NodeCheck) || typeU == "clash"){ // chuyển đổi node loại Clash
      type = (typeQ == "unsupported" || typeQ =="server")? "Clash":"wrong-field";
      typec = "server"
      content0 = Clash2QX(subs)
    } else if ( (((ModuleK.some(RewriteCheck) || subsn.some(IsMapLocalInline) || para1.indexOf("dst=rewrite") != -1) && (para1.indexOf("dst=filter") == -1) && subs.indexOf("[Proxy]") == -1) || typeU == "module") && typeU != "nodes" && typeU != "rule" && typeQ !="filter") { // module / rule-set loại Surge (gồm url-regex)
      typec="rewrite"
      type = (typeQ == "unsupported" || typeQ =="rewrite")? "sgmodule" : "wrong-field"
    } else if ((/(^hostname|\nhostname)\s*\=/.test(subi) || RewriteK.some(RewriteCheck) || JsonJQK.some(JsonJQCheck))  && para1.indexOf("dst=filter")==-1 && subi.indexOf("securehostname") == -1 && !/module|nodes|rule/.test(typeU) && !(RuleK.some(RuleCheck) && typeQ == "filter") && !(typeQ!= "rewrite" && QXProfile.some(ProfileCheck))) {
      // 2022-07-20 remove constrain && !/\[(Proxy|filter_local)\]/.test(subs)
      typec = "rewrite"
      type = (typeQ == "unsupported" || typeQ =="rewrite")? "rewrite":"wrong-field" //rewrite loại Quantumult X / Surge Script
    } else if (((RuleK.some(RuleCheck) && subs.indexOf(html) == -1 ) || (typeQ == "filter" && subsn.some(function (row) { return /^[a-z][\w-]*\s*,/i.test(row.trim()) })) || typeU == "rule" || para1.indexOf("dst=filter")!=-1) && typeU != "nodes" && !(typeQ == "server" && (QuanXK.some(NodeCheck) || SurgeK.some(NodeCheck))) ) {
      // loại rule/filter
      // 2022-07-20 remove constrain && !/\[(Proxy|server_local)\]/.test(subs) adter html
      typec = "filter"
      type = (typeQ == "unsupported" || typeQ =="filter")? "Rule":"wrong-field";
    } else if (typeU == "domain-set") {// Chỉ khi người dùng chỉ định domain-set;((DomainK.some(RuleCheck) || typeU == "domain-set") && subs.indexOf("[Proxy]") == -1 && typeU != "nodes") {
      typec = "filter-domain-set"
      type = (typeQ == "unsupported" || typeQ =="filter")? "Rule":"wrong-field";
      content0 = Domain2Rule(content0) // chuyển đổi domain-set
    } else if (typeQ == "filter" && subs.indexOf("payload:")==-1) { // loại list thuần?
      typec = "filter-list"
      type = (typeQ == "unsupported" || typeQ =="filter")? "Rule":"wrong-field";
      content0 = content0.split("\n").map(rule_list_handle).join("\n")
    } else if (typeQ == "filter" && subs.indexOf("payload:")!=-1) { // loại clash-provider?
      typec = "Clash-Provider"
      type = (typeQ == "unsupported" || typeQ =="filter")? "Rule":"wrong-field";
    } else if (subsn.length >= 1 && SubK2.some(NodeCheck2) && !/\[(Proxy|filter_local)\]/.test(subs)) { //subscription kết hợp nhiều dòng URI không mã hoá b64
      typec = "server-uri"
      type= (typeQ == "unsupported" || typeQ =="server" || typeQ =="uri") ? "Subs":"wrong-field"
    } else if ((subi.indexOf("tag=") != -1 && QuanXK.some(NodeCheck) && !/\[(Proxy|filter_local)\]/.test(subs)) || typeU =="list") {
      typec = "server-quanx"
      type = (typeQ == "unsupported" || typeQ =="server" || typeQ =="uri")? "Subs":"wrong-field" // QuanX list
    } else if (subs.indexOf("[Proxy]") != -1) {
      typec= "server-surge"
      type = (typeQ == "unsupported" || typeQ =="server" || typeQ =="uri")? "Surge":"wrong-field"; // Surge Profiles
      content0 = Surge2QX(content0).join("\n");
    } else if ((SurgeK.some(NodeCheck)  && !/\[(Proxy|filter_local)\]/.test(subs)) || typeU == "list") {
      typec="server-surge"
      type = (typeQ == "unsupported" || typeQ =="server" || typeQ =="uri")? "Subs":"wrong-field" // Surge proxy list
    } else if (subs.indexOf("[server_local]") != -1 && QuanXK.some(NodeCheck)) {
      //type = "QuanX"  // QuanX Profile
      typec="server-quanx"
      type = (typeQ == "unsupported" || typeQ =="server"|| typeQ =="uri")? "Subs":"wrong-field"
    } else if (subs.indexOf("server") !=-1 && subs.indexOf("server_port") !=-1) { //SIP008
      //type = "QuanX"
      typec= "server-sip008"
      type = (typeQ == "unsupported" || typeQ =="server")? "Subs":"wrong-field"
      content0 = SIP2QuanX(content0)
    } else if (SubK.some(NodeCheck1)) {  //loại subscription mã hoá b64
      typec="server-b64"
      type = (typeQ == "unsupported" || typeQ =="server")? "Subs-B64Encode":"wrong-field"
      if (content0.split("\n").length >= 2) { //  local snippet and first line remarks
        let tmp = content0.split("\n")[1]
        if (Pdbg) {$notify("local", "node", "\ntmp:\n"+tmp)}
        if (SubK.some((item) => tmp.toLowerCase().indexOf(item.toLowerCase()) != -1))
        content0 = tmp
      }
    } else if (QXProfile.every(ProfileCheck)) {
      typec = "profile"
      type = "profile"  //loại cấu hình mặc định
    }else if (/\.js/.test(link0)) { // hành vi xjb thêm script js
      Perror = 1 ; // không cần phản hồi
      $notify("⚠️ Nội dung liên kết bạn nhập vào là script JS","🚥 Trong script không có quy tắc rewrite, không thể phân tích để dùng", " Xin ⚠️đừng⚠️ đến trình phân tích🤖️ để phản hồi \n"+link0)
      type = "JS-0"
    } else if (typeQ =="server" && subs.length>100) { // một số trường hợp server mã hoá b64 không xác định
      typec="server-b64-unknown"
      type = (typeQ == "unsupported" || typeQ =="server")? "Subs-B64Encode":"wrong-field"
    } else if(subs == "wrong-link") {
      type="wrong-link"
    }
    //else if (typeQ == "URI")
  // dùng để thông báo loại đã nhận định, debug
  if(typeU == "X"){
    $notify("Loại đã nhận định cho liên kết này",type+" : " +typec, subs)
  }
  //$notify(type)
    return type
}

// Kiểm tra tên node (trùng lặp và tên trống) cùng các trường hợp QuanX không cho phép, và các cách viết “không chuẩn” như nhiều khoảng trắng
function TagCheck_QX(content) {
  typefix = {"shadowsocks":["𝐬𝐬","𝐒𝐒","🅢🅢","🆂🆂","ⓢⓢ","🅂🅂","SS"],"shadowsocksr":["𝐬𝐬𝐫","𝐒𝐒𝐑","🅢🅢🅡","🆂🆂🆁","ⓢⓢⓡ","🅂🅂🅁","SSR"],
    "vmess":["𝐯𝐦𝐞𝐬𝐬","𝐕𝐌𝐄𝐒𝐒","🅥🅜🅔🅢🅢","🆅🅼🅴🆂🆂","ⓥⓜⓔⓢⓢ","🅅🄼🄴🅂🅂","VMESS"],"trojan":["𝐭𝐫𝐨𝐣𝐚𝐧","𝐓𝐑𝐎𝐉𝐀𝐍","🅣🅡🅞🅙🅐🅝","🆃🆁🅾🅹🅰🅽","ⓣⓡⓞⓙⓐⓝ","🅃🅁🄾🄹🄰🄽","TROJAN"],
    "http":["𝐡𝐭𝐭𝐩","𝐇𝐓𝐓𝐏","🅗🅣🅣🅟","🅷🆃🆃🅿","ⓗⓣⓣⓟ","🄷🅃🅃🄿","HTTP"],"socks5":["𝐬𝐨𝗰𝗸𝐬","𝐒𝐎𝐂𝐊𝐒","🅢🅞🅒🅚🅢","🆂🅾🅲🅺🆂","ⓢⓄⒸⓀⓢ","🅂🄾🄲🄺🅂","SOCKS"],
    "vless":["𝐯𝐥𝐞𝐬𝐬","𝐕𝐋𝐄𝐒𝐒","🅥🅛🅔🅢🅢","🆅🅻🅴🆂🆂","ⓥⓛⓔⓢⓢ","🅅🄻🄴🅂🅂","VLESS"],"anytls":["𝐚𝐧𝐲𝐭𝐥𝐬","𝐀𝐍𝐘𝐓𝐋𝐒","🅐🅝🅨🅣🅛🅢","🅰🅽🆈🆃🅻🆂","ⓐⓝⓨⓣⓛⓢ","🄰🄽🅈🅃🄻🅂","𝖠𝖭𝖸𝖳𝖫𝖲"]
  } // type
  console.log(content)
    var Olist = content.map(item =>item.trim())//.replace(/\s{2,}/g," "))
    //$notify("","",Olist)
    var [Nlist, nmlist] = [ [], [] ]
    var [nulllist,duplist] = [ [], [] ]; //ghi lại node tên trống & node trùng tên
    var no=0 ;
    for (var i = 0; i < Olist.length; i++) {
        var item = Olist[i] ? Olist[i] : ""
        typefix["shadowsocks"]=item.indexOf("ssr-protocol")!=-1? typefix["shadowsocksr"] : typefix["shadowsocks"]
        if (item.replace(/ /gm, "").indexOf("tag=") != -1) {
            var nl = item.slice(item.indexOf("tag"))
            var nm = nl.slice(nl.indexOf("=") + 1)
            if (nm == "") { //tên trống
                tp = typefix[item.split("=")[0].trim()][3]
                nm = tp + " | " + item.split("=")[1].split(",")[0].split(":")[0]
                item = item.split("tag")[0] + "tag=" + nm.replace("shadowsocks", "ss")
                nulllist.push(nm.replace("shadowsocks", "ss"))
            }
            var ni = 0
            while (nmlist.indexOf(nm) != -1) { //trường hợp trùng tên
              //$notify("trùng tên",nm,nmlist)
                nm = ni==0? nm+ NoReplace(ni+1):nm.split(" ").slice(0,nm.split(" ").length-2).join(" ") + NoReplace(ni+1)
                item = Pdel != 1 ? item.split("tag")[0] + "tag=" + nm : ""
                ni = ni + 1
            }
            if (ni != 0) { duplist.push(nm) }
            nmlist.push(nm)
          if (Pcap) { 
            item = Capitalize(item,Pcap)
            console.log(item)
          }
          if (Pptn || Pnptn) { 
            item = Pattern(item,Pptn,Pnptn)
            console.log(item)
          }
            ni = 0
            if (item) {
            Nlist.push(item)
          }
        }// if "tag="
    } // for
    // Thêm tham số server_check_url
    if (PcheckU != "") {
      Nlist = Nlist.map(Add_URL)
    }
    if (nulllist.length >= 1) {
        no = nulllist.length <= 10 ? emojino[nulllist.length] : nulllist.length;
        $notify("⚠️ Tham chiếu" + "⟦" + subtag + "⟧" + " có" + no + " tên node trống ", "✅ Đã đặt “loại+IP” làm tên node", " ⨁ " + nulllist.join("\n ⨁ "), nan_link)
    }
    if (duplist.length >= 1) {
        no = duplist.length <= 10 ? emojino[duplist.length] : duplist.length;
      if (Pdel!=1 && Pntf0 != 0){
        $notify("⚠️ Tham chiếu" + "⟦" + subtag + "⟧" + " có" + no + " node trùng tên ", "✅ Đã thêm số để phân biệt, muốn xoá hãy thêm tham số del=1:", " ⨁ " + duplist.join("\n ⨁ "), nan_link)
      } else if (Pdel ==1 && Pntf0 != 0) {
        $notify("⚠️ Tham chiếu" + "⟦" + subtag + "⟧" + " có" + no + " node trùng tên ", "❌️ Đã xoá toàn bộ, nếu muốn giữ lại hãy bỏ tham số del=1:", " ⨁ " + duplist.join("\n ⨁ "), nan_link)
      }
    }
    return Nlist
}

// Thêm tham số server-check-url cho node
function Add_URL(cnt) {
  if (cnt) {
    cnt = cnt +", server_check_url="+PcheckU
  }
  return cnt
}

//Khi tên node trùng nhau thì thay bằng số thứ tự
function NoReplace(cnt) {
  if(cnt){
    for (var i=0;i<10;i++) {
      cnt = cnt.toString().replace(new RegExp(patn[0][i], "gmi"),patn[5][i])
    }
    return " " + cnt + " "
  }
}


// Thao tác pattern hoá tên node
function PatternN(cnt, para,npara) {
  if(cnt){
    if(para!=""){//ký tự
      for (var i=0;i<26;i++) {
        cnt = cnt.toLowerCase()
        cnt = cnt.replace(new RegExp(pat[0][i], "gmi"),pat[para][i])
      }
    }
    if(npara!=""){ //số
      for (var i=0;i<10;i++) {
        cnt = cnt.replace(new RegExp(patn[0][i], "gmi"),patn[npara][i])
      }
    }
    console.log(cnt)
    return cnt
  }
}


function Pattern(cnt,para,npara) {
  if (para != "" || npara != "") {
    cnt = cnt.split("tag=")[0] +"tag="+ PatternN(cnt.split("tag=")[1],para,npara)
  }
  return cnt 
}


//hoa/thường
function Capitalize(cnt,para) {
  if (para == 1) {
    cnt = cnt.split("tag=")[0] +"tag="+ cnt.split("tag=")[1].toUpperCase()
  } else if (para == -1) {
    cnt = cnt.split("tag=")[0] +"tag="+ cnt.split("tag=")[1].toLowerCase()
  } else if (para == 0) {
    cnt =cnt.split("tag=")[0] +"tag="+titleCase(cnt.split("tag=")[1])
  }
  return cnt
}

function titleCase(str) {
  var newStr = str.split(" ");
  for(var i = 0; i<newStr.length; i++){
    newStr[i] = newStr[i].slice(0,1).toUpperCase() + newStr[i].slice(1).toLowerCase();
  }    return newStr.join(" ");
}


// Tiền tố/hậu tố loại
function type_prefix(item) {
  if(item.trim()!="") {
    typefix = {"shadowsocks":"「𝐬𝐬」","vmess":"「𝐯𝐦𝐞𝐬𝐬」","trojan":"「𝐭𝐫𝐨𝐣𝐚𝐧」","http":"「𝐡𝐭𝐭𝐩」","socks5":"「𝐬𝐨𝗰𝗸𝐬」","vless":"「𝐯𝐥𝐞𝐬𝐬」","anytls":"「𝐚𝐧𝐲𝐭𝐥𝐬」"}
    typefix["shadowsocks"]=item.indexOf("ssr-protocol")!=-1? "「𝐬𝐬𝐫」" : "「𝐬𝐬」"
    tp = typefix[item.split("=")[0].trim()]
    return [[item.split("tag=")[0]+
      "tag=", tp, item.split("tag=")[1]].join(" ")].join(" ")
  }
}
function type_suffix(item) {
  if(item.trim()!=""){
    typefix={"shadowsocks":"「𝐬𝐬」","vmess":"「𝐯𝐦𝐞𝐬𝐬」","trojan":"「𝐭𝐫𝐨𝐣𝐚𝐧」","http":"「𝐡𝐭𝐭𝐩」","vless":"「𝐯𝐥𝐞𝐬𝐬」","anytls":"「𝐚𝐧𝐲𝐭𝐥𝐬」"}
    typefix["shadowsocks"]=item.indexOf("ssr-protocol")!=-1? "「𝐬𝐬𝐫」" : "「𝐬𝐬」"
    tp = typefix[item.split("=")[0].trim()]
    return [item, tp].join(" ")
  }
}

//Lấy loại
function getnode_type(item,ind) {
  if(item.trim()!="" && item.indexOf("tag=")!=-1) {
    ind = !/^(0|1|2|3|4|5|6|7)$/.test(ind) ? 8 : ind
    typefix = {"shadowsocks":["𝐬𝐬","𝐒𝐒","🅢🅢","🆂🆂","ⓢⓢ","🅂🅂","𝕊𝕊","ˢˢ","SS"],
      "shadowsocksr":["𝐬𝐬𝐫","𝐒𝐒𝐑","🅢🅢🅡","🆂🆂🆁","ⓢⓢⓡ","🅂🅂🅁","𝕊𝕊ℝ","ˢˢʳ","SSR"],
      "vmess":["𝐯𝐦𝐞𝐬𝐬","𝐕𝐌𝐄𝐒𝐒","🅥🅜🅔🅢🅢","🆅🅼🅴🆂🆂","ⓥⓜⓔⓢⓢ","🅅🄼🄴🅂🅂","𝕍𝕞𝕖𝕤𝕤","ᵛᵐᵉˢˢ","VMESS"],
      "trojan":["𝐭𝐫𝐨𝐣𝐚𝐧","𝐓𝐑𝐎𝐉𝐀𝐍","🅣🅡🅞🅙🅐🅝","🆃🆁🅾🅹🅰🅽","ⓣⓡⓞⓙⓐⓝ","🅃🅁🄾🄹🄰🄽","𝕋𝕣𝕠𝕛𝕒𝕟","ᵀʳᵒʲᵃⁿ","TROJAN"],
      "http":["𝐡𝐭𝐭𝐩","𝐇𝐓𝐓𝐏","🅗🅣🅣🅟","🅷🆃🆃🅿","ⓗⓣⓣⓟ","🄷🅃🅃🄿","𝕙𝕥𝕥𝕡","ʰᵗᵗᵖ","HTTP"],
      "socks5":["𝐬𝐨𝗰𝗸𝐬","𝐒𝐎𝐂𝐊𝐒","🅢🅞🅒🅚🅢","🆂🅾🅲🅺🆂","ⓢⓞⓒⓚⓢ","🅂🄾🄲🄺🅂","𝕤𝕠𝕔𝕜𝕤","ˢᵒᶜᵏˢ","SOCKS"],
      "vless":["𝐯𝐥𝐞𝐬𝐬","𝐕𝐋𝐄𝐒𝐒","🅥🅛🅔🅢🅢","🆅🅻🅴🆂🆂","ⓥⓛⓔⓢⓢ","🅅🄻🄴🅂🅂","𝕍𝕝𝕖𝕤𝕤","ᵛˡᵉˢˢ","VLESS"],
      "anytls":["𝐚𝐧𝐲𝐭𝐥𝐬","𝐀𝐍𝐘𝐓𝐋𝐒","🅐🅝🅨🅣🅛🅢","🅰🅽🆈🆃🅻🆂","ⓐⓝⓨⓣⓛⓢ","🄰🄽🅈🅃🄻🅂","𝔸𝕟𝕪𝕥𝕝𝕤","ᴬⁿʸᵗˡˢ","𝖠𝖭𝖸𝖳𝖫𝖲"]
    }
    typefix["shadowsocks"]=item.indexOf("ssr-protocol")!=-1? typefix["shadowsocksr"] : typefix["shadowsocks"]
    tp = typefix[item.split("=")[0].trim()][ind]
    return tp
  }
}


// Thao tác placeholder loại node
function type_handle(item) {
  if(item.indexOf("node_type_para_prefix")!=-1) {
    item = item.replace(/node_type_para_prefix(\d{0,1})/g,getnode_type(item,item.split("node_type_para_prefix")[1][0]))
  }
  return item
}

// Xử lý placeholder số thứ tự node
function index_handle(item) {
  items = item.map(item=>item.trim()).filter(Boolean)
  let b=Array.from(new Array(items.length),(val,index)=>index+1);
  //console.log(b[0])
  for (var i=0; i< items.length;i++){
    //$notify("rename"+i,Prname,items[i])
    if (items[i].indexOf("node_index_prefix") != -1) { // để placeholder không bị replace nhầm
    ind = items[i].split("node_index_prefix")[1][0]
    ind = !/^(0|1|2|3|4|5|6|7|8)$/.test(ind) ? 0 : ind
    console.log("handle index"+ind)
    items[i] = items[i].replace(/node_index_prefix(\d{0,1})/g,PatternN((i+1).toString(),"",ind))
  }
  }
  console.log(items)
  return items
}


// Thao tác placeholder emoji
function emoji_prefix_handle(item) {
  if(item.indexOf("node_emoji_flag_prefix")!=-1) {
    item = item.replace(/node_emoji_flag_prefix\d{0,1}/g,getnode_emoji(item,item.split("node_emoji_flag_prefix")[1][0]))
    //console.log(item)
  }
  return item
}

// Lấy emoji
function getnode_emoji(item,ind){
  ind = !/^(1|2)$/.test(ind) ? 2 : ind
  if(item.indexOf("tag=")!=-1) {
    return get_emoji(ind,item.split("tag=")[1])[1]
  }
}




// Thao tác tag của subscription
function tag_handle(item) {
  if(item.indexOf("node_tag_prefix")!=-1) {
    //item = item.replace(/node_tag_prefix/g,subtag)
    //console.log(item.split("node_tag_prefix")[1][1])
    ptnn = /\d/.test(item.split("node_tag_prefix")[1][0])? item.split("node_tag_prefix")[1][0]:""
    nptnn = /\d/.test(item.split("node_tag_prefix")[1][1])? item.split("node_tag_prefix")[1][1]:""
    //console.log(ptnn)
    item = item.replace(/node_tag_prefix\d{0,2}/g,PatternN(subtag,ptnn,nptnn))
  }
  return item
}

// Dùng cho tham số tag của một URI đơn, chỉ định trực tiếp tên node
function URI_TAG(cnt0,tag0) {
  cnt0 = cnt0.split("tag=")[0] + "tag=" + tag0
  return cnt0
}

// Thuận tiện cho việc triển khai chuỗi proxy
function ServerRelay(src,dst) {
  var rsts=[]
  for (var i=0; i<src.length; i++) {
    serverA = src[i].indexOf("-host")==-1? src[i].split("=")[1].split(":")[0].trim() : src[i].split("-host")[1].split("=")[1].split(",")[0].trim()
    type = /^[a-z]/.test(serverA) || /[a-z]$/.test(serverA)? "host":"ip"
    rst = type == "ip"? "ip-cidr,"+serverA+"/32,"+dst : "host-suffix,"+serverA+","+dst 
    rsts.push(rst)
  }
  return rsts.join("\n")
  
}

// Dùng cho vấn đề một số người dùng không dùng liên kết raw
function rawtest(cnt) {
  var Preg0 = RegExp(".*js-file-line\".*?\<\/td\>", "i")
  if (Preg0.test(cnt)) {
    return cnt.replace(/(.*js-file-line\"\>)(.*?)(\<\/td\>)/g,"$2").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").trim()
  }
}

function ToRaw(cnt) {
  cnt = cnt.split("\n").map(rawtest).filter(Boolean).join("\n")
  var rawlink = link0.replace("github.com","raw.githubusercontent.com").replace("/blob","")
  if (cnt) {
    $notify( "⚠️⚠️ Sẽ thử phân tích tài nguyên này" + "⟦" + subtag + "⟧" , "🚥 Vui lòng dùng đúng liên kết raw của GitHub" , "❌ Liên kết của bạn:"+link0+"\n✅ Liên kết đúng:"+rawlink, {"open-url":rawlink})
  } else if(content0.indexOf("gridcell")!=-1) {
    $notify( "⚠️⚠️ Phân tích tài nguyên này" + " ⟦" + subtag + "⟧ thất bại" , "🚥 Liên kết của bạn có vẻ là thư mục, không phải file" , "❌ Liên kết của bạn:"+link0, {"open-url":link0})
  }
  return cnt
}

function ToLink(link) {
  cnt = link.split("nsloon.com/openloon/import?plugin=")[1]
  if (cnt) {
    
    typ=$resource.type
    RLink0[Field[typ]].push(cnt+", opt-parser=true, tag=🉑️长点❤️8⃣️") //  Chuyển hướng URI-Scheme
    flink = ADDRes.replace(/url-encoded-json/,encodeURIComponent(JSON.stringify(RLink0)))
    $notify( "⚠️ Vui lòng nhấn vào thông báo để chuyển hướng và thử thêm liên kết đúng" , "🚥 Vui lòng dùng đúng liên kết gốc" , "❌ Liên kết của bạn:"+link0+"\n✅ Liên kết đúng:"+cnt, {"open-url":flink})
  } 
  return "wrong-link"
}

function CDN(cnt) {
  console.log("CDN start")
  cnt = cnt.map(item => RuleNoteMap(item, body => body.replace(/https:\/\/raw.githubusercontent.com\/(.*?)\/(.*?)\/(.*)/gmi,"https://fastly.jsdelivr.net/gh/$1/$2@$3"))).join("\n")
  return cnt
}

// Chỉ định tham số host của node
function HOST_Handle(cnt,phost) {
  phost="host="+phost+","
  if (phost.indexOf("☠️") == -1) { //chỉ thay thế loại host đã có
    cnt = cnt.replace(/host\s*\=(.*?)\,/,phost)
  } else { // thay thế cho cái đã có, thêm cho cái chưa có obfs-host\tls-host
    phost=phost.split("☠️")[0]
    if (/-host\s*\=/.test(cnt)) {// nếu đã có tham số host
      cnt = cnt.replace(/host\s*\=(.*?)\,/,phost+", ")
    } else if (/over-tls\s*\=\s*true/.test(cnt)) { // nếu chưa có host nhưng có thể thêm
      cnt = cnt+", tls-"+phost
    } else if (/obfs\s*\=/.test(cnt)) {
      cnt = cnt + ", obfs-"+phost
    }
  }
  return cnt
}

// Chỉ định tham số obfs=xx-http của node
function OBFS_Handle(cnt,pobfs) {
  if (pobfs == "shttp") {
    pobfs="obfs="+"shadowsocks-http"
  } else if (pobfs == "vhttp") {
    pobfs="obfs="+"vmess-http"
  } else { 
    pobfs="invalid"
  }
  if (/obfs\s*\=\s*http/.test(cnt) && pobfs!="invalid") { //chỉ thay thế khi có tham số obfs=http
    cnt = cnt.replace(/obfs\s*\=\s*http/,pobfs)
  }
  return cnt
}

// Chỉ định tham số tls-no-session-ticket/reuse của node
function Session_Handle(cnt,psession) {
  let st = ", tls-no-session-ticket=true"
  let sr = ", tls-no-session-reuse=true"
  if (psession == 0) {
    cnt =cnt + st
  } else if (psession == 1) {
     cnt =cnt + sr
  } else if (psession == 2){ 
    cnt =cnt + st + sr
  }
  return cnt
}

// Chỉ định tham số cert-sha256 pubkey-sha256
function SHA256_Handle(cnt,pcsha256,ppsha256) {
  if (cnt.indexOf("over-tls=true")!=-1 || cnt.indexOf("obfs=wss")!=-1) {
    cnt = cnt.replace(/tls-verification\s*\=\s*false(\s*)\,/,"") //loại bỏ tls-verification=false
    //$notify("SHA256",cnt,Pcsha256+Ppsha256)
    cnt = pcsha256!=""? cnt.replace(/tag\s*\=/,"tls-cert-sha256="+pcsha256+", tag=") : cnt
    cnt = ppsha256!=""? cnt.replace(/tag\s*\=/,"tls-pubkey-sha256="+ppsha256+", tag=") : cnt
  }
  return cnt
}

// Chỉ định tham số alpn, loại over-tls?
function ALPN_Handle(cnt,palpn) {
  cnti = cnt.replace(/\s/gmi,"") //xoá khoảng trắng
  if (cnti.indexOf("obfs=over-tls") != -1 || cnti.indexOf("over-tls=true")!=-1) {
    cnt = cnt + ", tls-alpn="+palpn
  }
  return cnt
}

// Ghi chú sửa Map Local ⟦2026-09-16 11:05 +08⟧
// Ưu tiên hiệu quả nội dung: nội dung trống dùng reject-200, JSON rỗng dùng phản hồi tích hợp, các văn bản an toàn còn lại dùng response-body.
// Thay thế nội dung sẽ truy cập upstream, không đảm bảo mã trạng thái/tiêu đề phản hồi gốc, phản hồi trống không thực thi; không gắn chú thích cuối dòng.
// Không tạo file hay script phụ trợ; các trường hợp khác 200, tiêu đề phản hồi thừa và văn bản thay thế không thể biểu đạt an toàn vẫn bị bỏ qua.
// ⟦2026-09-16 11:17 +08⟧ Chỉ thông báo các mục gốc chưa chuyển đổi cùng lý do từng mục, mục chuyển đổi thành công không thông báo nữa.
// Ghi chú sửa module ⟦2026-09-16 11:55 +08⟧：tiny-gif dùng reject-img tích hợp, không phụ thuộc file cục bộ.
function IsMapLocalInline(row) {
    var text = row.trim()
    return !/^(?:#|;|\/\/)/.test(text) && /^(?:"[^"]+"|\S+)\s+(?:data(?:-type)?|status-code|header)\s*=/i.test(text) && /\sdata-type\s*=\s*(?:"(?:text|tiny-gif)"|'(?:text|tiny-gif)'|text|tiny-gif)(?=\s|$)/i.test(text)
}

function MapLocalInline2QX(row, ignored) {
    function skip(reason) {
        if (ignored) { ignored.push({ rule: row, reason: reason }) }
        return ""
    }
    var rule = row.match(/^("[^"]+"|\S+)(\s+[\s\S]+)$/)
    if (!rule) { return skip("Không nhận dạng được biểu thức khớp URL hoặc phần tham số") }
    var rest = rule[2], options = Object.create(null)
    while (rest.trim()) {
        var field = rest.match(/^\s+(data-type|data|status-code|header)\s*=\s*/i)
        if (!field) { return skip("Chứa tham số không xác định, chú thích cuối dòng hoặc định dạng tham số sai") }
        var key = field[1].toLowerCase()
        if (options[key] !== undefined) { return skip("Tham số " + key + " bị lặp") }
        rest = rest.slice(field[0].length)
        var quote = rest[0], end = 0, value = ""
        if (quote === '"' || quote === "'") {
            // data="{"no":0}" Dấu ngoặc kép bên trong không kết thúc trường, chỉ kết thúc nội dung tại ranh giới tham số.
            for (end = 1; end < rest.length; end++) {
                if (rest[end] === "\\") { end++; continue }
                if (rest[end] !== quote) { continue }
                if (key !== "data" || /^\s*$|^\s+(?:[a-z][\w-]*\s*=|#|;|\/\/)/i.test(rest.slice(end + 1))) { break }
            }
            if (end >= rest.length) { return skip("Dấu ngoặc kép của tham số " + key + " chưa đóng hoặc không xác định được ranh giới") }
            value = rest.slice(1, end)
            end++
        } else {
            var token = rest.match(/^[^\s"'\\]+/)
            if (!token) { return skip("Tham số " + key + " thiếu giá trị hợp lệ") }
            value = token[0]
            end = value.length
        }
        options[key] = value
        rest = rest.slice(end)
        if (rest && !/^\s/.test(rest)) { return skip("Thiếu khoảng trắng phân tách giữa các tham số") }
    }
    var tinyGif = /^tiny-gif$/i.test(options["data-type"] || "")
    if (!tinyGif && !/^text$/i.test(options["data-type"] || "")) { return skip("data-type không phải text hay tiny-gif, không thể chuyển đổi theo nội dung tích hợp") }
    if (!tinyGif && options.data === undefined) { return skip("Thiếu tham số nội dung data") }
    var status = options["status-code"] === undefined ? "200" : options["status-code"]
    if (status !== "200") { return skip("Mã trạng thái chỉ định là " + status + ", chuyển đổi hiện tại chỉ hỗ trợ 200") }
    if (options.header !== undefined && !/^Content-Type\s*:\s*[\w.+-]+\/[\w.+-]+(?:\s*;\s*charset\s*=\s*[\w-]+)?\s*$/i.test(options.header)) { return skip("Chứa tiêu đề phản hồi thừa hoặc tham số Content-Type không nhận dạng được") }
    if (tinyGif) {
        if (options.data !== undefined || (options.header !== undefined && !/^Content-Type\s*:\s*image\/gif\s*$/i.test(options.header))) { return skip("tiny-gif chứa nội dung tuỳ chỉnh hoặc tiêu đề phản hồi không phải image/gif, không thể giữ bằng reject-img") }
        return rule[1] + " url reject-img"
    }
    var action = "", simpleJSON = options.header === undefined || /^Content-Type\s*:\s*application\/json(?:\s*;\s*charset\s*=\s*[\w-]+)?\s*$/i.test(options.header)
    if (/^[ \t]*$/.test(options.data)) {
        action = "reject-200"
    } else if (simpleJSON) {
        try {
            var body = JSON.parse(options.data)
            if (body && typeof body === "object" && Object.keys(body).length === 0) { action = Array.isArray(body) ? "reject-array" : "reject-dict" }
        } catch (err) { /* Văn bản không phải JSON tiếp tục thử thay thế nội dung gốc. */ }
    }
    if (action) { return rule[1] + " url " + action }
    // Không đoán quy tắc escape của QX đối với mẫu thay thế, tránh tham chiếu nhóm $, dấu gạch chéo ngược, ký tự điều khiển hoặc ký tự phân tách làm thay đổi nội dung.
    if (/[\\$\x00-\x1f\x7f\u2028\u2029]/.test(options.data)) { return skip("Nội dung chứa $, dấu gạch chéo ngược hoặc ký tự điều khiển, không thể đảm bảo thay thế nguyên văn") }
    if (options.data !== options.data.trim()) { return skip("Khoảng trắng đầu/cuối của nội dung không rỗng không thể đảm bảo giữ nguyên") }
    if (/\s(?:response-body|url-and-header)\s/.test(options.data)) { return skip("Nội dung chứa ký tự phân tách rewrite, có thể bị QX coi là cú pháp quy tắc") }
    return rule[1] + " url response-body ^[\\s\\S]+$ response-body " + options.data
}

function Mock2QXReject(row, filename) {
    if (/dict/i.test(filename)) {
        return row.replace(/ /g, "").split("data=")[0].split("data-type=")[0] + " url " + "reject-dict"
    } else if (/array/i.test(filename)) {
        return row.replace(/ /g, "").split("data=")[0].split("data-type=")[0] + " url " + "reject-array"
    } else if (/(txt|html)/i.test(filename) || filename==null) {
        return row.replace(/ /g, "").split("data=")[0].split("data-type=")[0] + " url " + "reject-200"
    } else if (/(png|jpg|gif)/i.test(filename)) {
        return row.replace(/ /g, "").split("data=")[0].split("data-type=")[0] + " url " + "reject-img"
    } else {
        return row.replace(/ /g, "").split("data=")[0].split("data-type=")[0] + " url " + "reject"
    }
}

//Chuyển đổi url-regex thành rewrite của Quantumult X
function URX2QX(subs) {
    var nrw = []
    var rw = ""
    subs = subs.split("\n")
    //$notify("URX")
    var NoteK = ["//", "#", ";"];  //loại trừ mục chú thích
    for (var i = 0; i < subs.length; i++) {
        const notecheck = (item) => subs[i].indexOf(item) == 0
        if (!NoteK.some(notecheck)) {
        if (subs[i].slice(0, 9) == "URL-REGEX") {  // regex loại
          if (subs[i].indexOf("REJECT") != -1 || subs[i].split(",").length == 2 ) { // chỉ xử lý loại reject, hoặc loại không chỉ định chính sách
            if (subs[i].replace(/ /g, "").split(",REJECT")[0].split("GEX,")[1].slice(0,1) != "*") { // một số dạng url-regex bắt đầu bằng * không được hỗ trợ
            rw = subs[i].replace(/ /g, "").split(",REJECT")[0].split("GEX,")[1] + " url " + "reject-200"
            nrw.push(rw)
          }
          }
        } else if (subs[i].indexOf("data=") != -1 && subs.indexOf("[Map Local]") != -1){ // loại Map Local
            // lấy tên file của subs[i]
            let fn = subs[i].match(/data=.+\/(.+)"/) ? subs[i].match(/data=.+\/(.+)"/)[1] : null
            if ((!/header=".*content-type/i.test(subs[i]) && /blank/i.test(fn)) || fn==null) {
                rw = Mock2QXReject(subs[i], fn)
            } else {
                rw = subs[i].replace(/ /g, "").split("data=")[0].split("data-type=")[0].replace(/\"/g,"") + " url echo-response text/html echo-response " + subs[i].split("data=")[1].split(" ")[0].replace(/\"/g,"").replace(/ /g, "")//"reject-dict"
                if (subs[i].indexOf("header=")!=-1) {
                    if (subs[i].indexOf("Content-Type:") !=-1) {
                        let tpe = subs[i].split("header=")[1].split("Content-Type:")[1].split(",")[0].replace(/\"/g,"")
                        rw = rw.replace(/text\/html/g,tpe)
                    }
                }
            }
            nrw.push(rw)
        } 
    }
    }
    //$notify("URX","",nrw)
    return nrw
}

/*
Ghi chú chuyển đổi rewrite JSON-JQ ⟦2026-07-07 20:24:29 +08⟧
----------------------------------------------------------
Chỉ thay đổi resource-parser-r.js.
Thêm mới/mở rộng các chuyển đổi cú pháp đầu vào sau:
  - pattern response-body-json-jq 'jq expression'      -> pattern url jsonjq-response-body 'jq expression'
  - pattern request-body-json-jq 'jq expression'       -> pattern url jsonjq-request-body 'jq expression'
  - pattern response-body-json-del paths               -> pattern url jsonjq-response-body 'del(...)' / 'delpaths(...)'
  - pattern response-body-json-replace path value, ... -> pattern url jsonjq-response-body 'if ... then setpath(...) else . end'
----------------------------------------------------------
*/
function IsJsonJQRewrite(row) {
  return /^\s*(?:http-(?:request|response)-jq(?:\s|$)|(?:"[^"]+"|'[^']+'|\S+)\s+(?:response-body-json-jq|request-body-json-jq|response-body-json-del|response-body-json-replace)(?:\s|$))/i.test(row);
}

function JsonJQRewrite2QX(row) {
  function stripOuterJQQuotes(str) {
    str = typeof str == "undefined" || str === null ? "" : String(str).trim();
    if (str.length > 1 && ((str[0] == "'" && str[str.length - 1] == "'") || (str[0] == "\"" && str[str.length - 1] == "\""))) {
      return str.slice(1, -1);
    }
    return str;
  }

  function quoteJQExpression(str) {
    return "'" + str.replace(/'/g, "\\'") + "'";
  }

  function normalizeJsonPattern(pattern) {
    pattern = stripOuterJQQuotes(pattern);
    if (/^\^?https?\??/i.test(pattern)) {
      return pattern;
    }
    return pattern;
  }

  function splitTopLevel(str, delimiter) {
    var parts = [];
    var buf = "";
    var quote = "";
    var escaped = false;
    var depth = 0;
    for (var i = 0; i < str.length; i++) {
      var ch = str[i];
      if (quote) {
        buf += ch;
        if (quote == "\"" && ch == "\\" && !escaped) {
          escaped = true;
          continue;
        }
        if (quote == "'" && ch == "'" && str[i + 1] == "'") {
          buf += str[++i];
          continue;
        }
        if (ch == quote && !escaped) {
          quote = "";
        }
        escaped = false;
      } else if (ch == "\"" || ch == "'") {
        quote = ch;
        buf += ch;
      } else if (ch == "[" || ch == "{" || ch == "(") {
        depth++;
        buf += ch;
      } else if (ch == "]" || ch == "}" || ch == ")") {
        depth--;
        buf += ch;
      } else if (ch == delimiter && depth == 0) {
        if (buf.trim() != "") {
          parts.push(buf.trim());
        }
        buf = "";
      } else {
        buf += ch;
      }
    }
    if (buf.trim() != "") {
      parts.push(buf.trim());
    }
    return parts;
  }

  function splitTopLevelCommaOrSemi(str) {
    var commaParts = splitTopLevel(str, ",");
    if (commaParts.length > 1) {
      return commaParts;
    }
    return splitTopLevel(str, ";");
  }

  function splitTopLevelWhitespace(str) {
    var parts = [];
    var buf = "";
    var quote = "";
    var escaped = false;
    var depth = 0;
    for (var i = 0; i < str.length; i++) {
      var ch = str[i];
      if (quote) {
        buf += ch;
        if (quote == "\"" && ch == "\\" && !escaped) {
          escaped = true;
          continue;
        }
        if (ch == quote && !escaped) {
          quote = "";
        }
        escaped = false;
      } else if (ch == "\"" || ch == "'") {
        quote = ch;
        buf += ch;
      } else if (ch == "[" || ch == "{" || ch == "(") {
        depth++;
        buf += ch;
      } else if (ch == "]" || ch == "}" || ch == ")") {
        depth--;
        buf += ch;
      } else if (/\s/.test(ch) && depth == 0) {
        if (buf.trim() != "") {
          parts.push(buf.trim());
        }
        buf = "";
      } else {
        buf += ch;
      }
    }
    if (buf.trim() != "") {
      parts.push(buf.trim());
    }
    return parts;
  }

  function findTopLevelOperator(str, ops) {
    var quote = "";
    var escaped = false;
    var depth = 0;
    for (var i = 0; i < str.length; i++) {
      var ch = str[i];
      if (quote) {
        if (quote == "\"" && ch == "\\" && !escaped) {
          escaped = true;
          continue;
        }
        if (ch == quote && !escaped) {
          quote = "";
        }
        escaped = false;
      } else if (ch == "\"" || ch == "'") {
        quote = ch;
      } else if (ch == "[" || ch == "{" || ch == "(") {
        depth++;
      } else if (ch == "]" || ch == "}" || ch == ")") {
        depth--;
      } else if (depth == 0) {
        for (var j = 0; j < ops.length; j++) {
          if (str.slice(i, i + ops[j].length) == ops[j]) {
            return { index: i, op: ops[j] };
          }
        }
      }
    }
    return null;
  }

  function normalizeJsonPath(path) {
    path = stripOuterJQQuotes(path);
    if (path.indexOf("$.") == 0) {
      return "." + path.slice(2);
    }
    if (path[0] != "." && path[0] != "[" && path.indexOf("getpath(") != 0) {
      return "." + path;
    }
    return path;
  }

  function pathToSegments(path) {
    path = stripOuterJQQuotes(path);
    if (path.indexOf("$.") == 0) {
      path = path.slice(2);
    } else if (path[0] == "$") {
      path = path.slice(1);
    }
    if (/^\[[\s\S]*\]$/.test(path)) {
      try {
        var arr = JSON.parse(path);
        return Array.isArray(arr) ? arr : null;
      } catch (err) {
        return null;
      }
    }
    path = path.replace(/\[['"]([^'"]+)['"]\]/g, ".$1").replace(/\[(\d+)\]/g, ".$1");
    if (path[0] == ".") {
      path = path.slice(1);
    }
    if (!/^[^.\s]+(\.[^.\s]+)*$/.test(path)) {
      return null;
    }
    return path.split(".").map(function(part) {
      return /^\d+$/.test(part) ? Number(part) : part;
    });
  }

  function canUseDirectJQPath(path) {
    return /^\.[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/.test(path);
  }

  function jqValueLiteral(value) {
    value = stripOuterJQQuotes(value);
    if (value == "") {
      return "null";
    }
    if (/^(true|false|null)$/i.test(value) || /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(value)) {
      return value.toLowerCase();
    }
    if (/^["\[{]/.test(value) || /^(if\s|\.|getpath\(|setpath\(|del\(|delpaths\()/.test(value)) {
      return value;
    }
    return JSON.stringify(value);
  }

  function buildDelJQ(payload) {
    payload = stripOuterJQQuotes(payload);
    if (/^(del|delpaths)\s*\(/.test(payload)) {
      return payload;
    }
    if (/^\[\s*\[/.test(payload)) {
      return "delpaths(" + payload + ")";
    }
    var paths = splitTopLevelCommaOrSemi(payload);
    if (paths.length == 1) {
      var ws = splitTopLevelWhitespace(payload);
      if (ws.length > 1) {
        paths = ws;
      }
    }
    paths = paths.map(function(path) {
      return normalizeJsonPath(path);
    }).filter(Boolean);
    if (paths.length == 0) {
      return "";
    }
    if (paths.every(canUseDirectJQPath)) {
      return "del(" + paths.join(", ") + ")";
    }
    var segments = paths.map(pathToSegments);
    if (segments.every(function(item) { return Array.isArray(item) })) {
      return "delpaths(" + JSON.stringify(segments) + ")";
    }
    return "del(" + paths.join(", ") + ")";
  }

  function parseReplacePair(item) {
    var found = findTopLevelOperator(item, ["=>", "="]);
    if (found) {
      return {
        path: item.slice(0, found.index).trim(),
        value: item.slice(found.index + found.op.length).trim()
      };
    }
    var parts = splitTopLevelWhitespace(item);
    if (parts.length >= 2) {
      return {
        path: parts[0],
        value: parts.slice(1).join(" ")
      };
    }
    return null;
  }

  function buildSafeSetpath(path, value) {
    var segments = pathToSegments(path);
    var literal = jqValueLiteral(value);
    if (!segments || segments.length == 0) {
      return normalizeJsonPath(path) + " = " + literal;
    }
    var parent = segments.slice(0, -1);
    var key = segments[segments.length - 1];
    var typeCheck = typeof key == "number" ? "type == \"array\" and has(" + key + ")" : "type == \"object\" and has(" + JSON.stringify(key) + ")";
    return "if (getpath(" + JSON.stringify(parent) + ")? | " + typeCheck + ") then setpath(" + JSON.stringify(segments) + "; " + literal + ") else . end";
  }

  function buildReplaceJQ(payload) {
    payload = stripOuterJQQuotes(payload);
    if (/^(if\s|setpath\(|getpath\(|reduce\s|map\(|walk\()/.test(payload)) {
      return payload;
    }
    try {
      var obj = JSON.parse(payload);
      if (obj && typeof obj == "object" && !Array.isArray(obj)) {
        return Object.keys(obj).map(function(key) {
          return buildSafeSetpath(key, JSON.stringify(obj[key]));
        }).join(" | ");
      }
    } catch (err) {}
    var items = splitTopLevelCommaOrSemi(payload);
    var expressions = [];
    for (var i = 0; i < items.length; i++) {
      var pair = parseReplacePair(items[i]);
      if (pair) {
        expressions.push(buildSafeSetpath(pair.path, pair.value));
      }
    }
    return expressions.join(" | ");
  }

  // ⟦2026-09-16 11:55 +08⟧ Hành động Surge đứng trước URL, giữ nguyên khoảng trắng, dấu ngoặc kép và thứ tự phép toán trong nội dung jq.
  var surge = row.match(/^\s*http-(request|response)-jq\s+(\"[^\"]+\"|'[^']+'|\S+)\s+([\s\S]+?)\s*$/i);
  if (surge) {
    var surgePattern = normalizeJsonPattern(surge[2]);
    if (/^http-(?:request|response)(?:-jq)?$/i.test(surgePattern) || /\s|^["']/.test(surgePattern)) { return "" }
    var expression = surge[3].trim();
    if ((expression[0] == "'" || expression[0] == '"') && expression.slice(-1) != expression[0]) { return "" }
    row = surge[2] + " " + surge[1].toLowerCase() + "-body-json-jq " + expression;
  }
  var matched = row.match(/^\s*(\"[^\"]+\"|'[^']+'|\S+)\s+(response-body-json-jq|request-body-json-jq|response-body-json-del|response-body-json-replace)\s+([\s\S]+?)\s*$/i);
  if (!matched) { return "" }
  var pattern = normalizeJsonPattern(matched[1]);
  var action = matched[2].toLowerCase();
  var body = matched[3].trim();
  var type = action == "request-body-json-jq" ? "jsonjq-request-body" : "jsonjq-response-body";
  var jq = "";
  if (action == "response-body-json-del") {
    jq = buildDelJQ(body);
  } else if (action == "response-body-json-replace") {
    jq = buildReplaceJQ(body);
  } else {
    jq = stripOuterJQQuotes(body);
  }
  return jq ? pattern + " url " + type + " " + quoteJQExpression(jq) : "";
}

//Chuyển đổi script & rewrite thành Quantumult X
function SCP2QX(subs) {
  var nrw = []
  var rw = ""
  var RewriteK = [" url 302", " url 307", " url reject", " url script", " url req", " url res", " url echo", " url-and-header 302", " url-and-header 307", " url-and-header reject", " url-and-header script", " url-and-header req", " url-and-header res", " url-and-header echo", " url jsonjq"] // rewrite loại Quantumult X
  var rawSubs = subs.split("\n").map(x => x.trim())
  subs = rawSubs.map(x => x.replace(/\s+/g," "))
  //$notify("Script","",subs)
  for (var i = 0; i < subs.length; i++) {
    try {
      //$notify(i,"",subs[i])
      subs[i] = subs[i].replace("^http","http") // bỏ ^ để tiện khử trùng lặp
      if (subs[i].slice(0, 8) == "hostname") {
        hn = subs[i].replace(/\%.*\%/g, "").replace(/\:\d*/g,"")
        nrw.push(hn)
      }
      var SC = ["type=", ".js", "pattern=", "script-path="]
      var NoteK = ["//", "#", ";"]; //loại trừ mục chú thích
      const sccheck = (item) => subs[i].indexOf(item) != -1
      const notecheck = (item) => subs[i].indexOf(item) == 0
      const RewriteCheck = (item) => subs[i].indexOf(item) != -1 ; // nhận định rewrite của QuanX
      if (!NoteK.some(notecheck) && !RewriteK.some(RewriteCheck)){
        if(Pdbg==1) {$notify("rewrite-check","",subs[i])}
        if (IsJsonJQRewrite(rawSubs[i])) {
          rw = JsonJQRewrite2QX(rawSubs[i])
          if (rw != "") {
            nrw.push(rw)
          }
        } else if (SC.every(sccheck)) { // định dạng mới của surge js
          //vấn đề một số regex chứa dấu phẩy
          ptn = subs[i].replace(/\s/gi,"").split("pattern=")[1].split(/\,[a-zA-Z]/)[0] 
          js = subs[i].replace(/\s/gi,"").split("script-path=")[1].split(",")[0]
          type = subs[i].replace(/\s/gi,"").split("type=")[1].split(",")[0].trim()
          subsi = subs[i].replace(/ /g,"").replace(/\=true/g,"=1")
          if (type == "http-response" && subsi.indexOf("requires-body=1") != -1) {
            type = "script-response-body "
          } else if (type == "http-response" && subsi.indexOf("requires-body=1") == -1) {
            type = "script-response-header "
          } else if (type == "http-request" && subsi.indexOf("requires-body=1") != -1) {
            type = "script-request-body "
          } else if (type == "http-request" && subsi.indexOf("requires-body=1") == -1) {
            type = "script-request-header "
          } else {type = "" }
          if (type != "") {
            rw = ptn + " url " + type + js
            nrw.push(rw)
          }
        } else if (/\d\s30(7|2)$/.test(subs[i])) { //viết lại rewrite 302&307 (Surge)
          //tpe = subs[i].indexOf(" 302") != -1? "302":"307"
          //$notify("307/2",subs[i])
          rw = subs[i].split(" ")[0] + " url " + subs[i].split(" ")[2] + " " + subs[i].split(" ")[1].trim()
          //if(rw.indexOf("307")!=-1) {$notify("XX",subs[i],rw.split(" "))}
          nrw.push(rw)
        } else if (/\d\s\-\s30(2|7)\s/.test(subs[i])) { //viết lại rewrite 302&307 (Shadowrocket)
          //xx - 302 $1$2$3
          rw = subs[i].replace(" - "," url ")
          nrw.push(rw)
        } else if(subs[i].split(" ")[2] == "header") { // loại rewrite header
          var pget = subs[i].split(" ")[0].split(".com")[1]
          var pgetn = subs[i].split(" ")[1].split(".com")[1]
          rw = subs[i].split(" ")[0] + " url 302 " + subs[i].split(" ")[1]
          //rw = subs[i].split(" ")[0] + " url request-header ^GET " + pget +"(.+\\r\\n)Host:.+(\\r\\n) request-header GET " + pgetn + "$1Host: " + subs[i].split(" ")[1].split("://")[1].split(".com")[0] + ".com$2"
          nrw.push(rw)
        } else if(subs[i].split(" ")[1] == "header-replace") { // loại rewrite header-replace
          console.log(subs[i])
          var pget = subs[i].split("header-replace")[1].split(":")[0].trim()
          var pgetn = subs[i].split("header-replace")[1].trim()
          rw = subs[i].split(" ")[0] + " url request-header " +"(.+\\r\\n)"+pget+":.+(\\r\\n) request-header " + "$1" + pgetn + "$2"
          nrw.push(rw)
        } else if(subs[i].indexOf(" _ reject") != -1) { // loại rewrite reject (surge)
          rw = subs[i].split(" ")[0] + " url reject-200"
          nrw.push(rw)
        } else if(subs[i].indexOf(" - reject") != -1 || subs[i].indexOf(" - REJECT") != -1) { //shadowrocket reject/REJECT
          rw = subs[i].replace(" - ", " url ").toLowerCase()
          nrw.push(rw)
        } else if(subs[i].split(" ").length == 2 && (/\s(reject)$/.test(subs[i]) || /\s(reject\-)/.test(subs[i]))){ // loại loon? http://xxx/yyy reject
          rw = subs[i].replace(" reject", " url reject")
          nrw.push(rw)
        } else if (subs[i].indexOf("script-path") != -1) { //cách viết cũ của surge js
          type = subs[i].replace(/\s+/g," ").split(" ")[0]
          js = subs[i].split("script-path")[1].split("=")[1].split(",")[0]
          ptn = subs[i].replace(/\s+/g," ").split(" ")[1]
          subsi = subs[i].replace(/ /g,"").replace(/\=true/g,"=1")
          if (type == "http-response" && subsi.indexOf("requires-body=1") != -1) {
            type = "script-response-body "
          } else if (type == "http-response" && subsi.indexOf("requires-body=1") == -1) {
            type = "script-response-header "
          } else if (type == "http-request" && subsi.indexOf("requires-body=1") != -1) {
            type = "script-request-body "
          } else if (type == "http-request" && subsi.indexOf("requires-body=1") == -1) {
            type = "script-request-header "
          } else {type = "" }
          if (type != "") {
            rw = ptn + " url " + type + js
            nrw.push(rw)
          } 
        }
      } else if(RewriteK.some(RewriteCheck)) {
        nrw.push(subs[i])
      }
    } catch (err) {
      $notify("❌️Đã xảy ra lỗi khi phân tích mục này, đã bỏ qua",subs[i],err)
    }
  }
  return nrw
}

// Nếu cả URL-Regex và rewrite/script đều cần
function SGMD2QX(subs) {
    var nrw0 = URX2QX(subs)
    var nrw1 = SCP2QX(subs)
    var nrwt = [...nrw0, ...nrw1]
    return nrwt
}

//Lọc Rewrite, dùng + nối nhiều từ khoá (logic "hoặc"): in để giữ lại, out để loại trừ
function Rewrite_Filter(subs, Pin, Pout,Preg,Pregout, hasUnsupported) {
    if (!subs.length && hasUnsupported) { return [] } // Khi toàn bộ chuyển đổi thất bại đã có tổng hợp, không thông báo lặp kết quả trống.
    var Nlist = [];
    var noteK = ["//", "#", ";"];
    var hnc = 0;
    var dwrite = []
    var hostname = ""
    //$notify("S0","Content",subs)
    for (var i = 0; i < subs.length; i++) {
        var noteParts = RuleNoteSplit(subs[i].trim());
        subi = noteParts.body;
        var subii = subi.replace(/ /g, "")
        if (subi != "" && (subi.indexOf(" url ")!=-1 || subi.indexOf("host")!=-1 || /^(?:ip-cidr|ip6-cidr|geoip|ip-asn|user-agent)\s*,/i.test(subi) || subi.indexOf(" url-and-header ")!=-1 || /^hostname\=/.test(subii))) {
            const notecheck = (item) => subi.indexOf(item) == 0
            if (noteK.some(notecheck)) { // mục chú thích bỏ qua 
                continue;
            } else if (hnc == 0 && subii.indexOf("hostname=") == 0) { //phần hostname
                hostname = (Phin0 || Phout0 || Preg || Pregout) ? HostNamecheck(subi, Phin0, Phout0) : subi;//phần hostname
            } else if (subii.indexOf("hostname=") != 0) { //phần rewrite
                var inflag = Rcheck(subi, Pin);
                var outflag = Rcheck(subi, Pout);
                if (outflag == 1 || inflag == 0) {
                    dwrite.push(RuleNoteJoin(noteParts.note, /^[a-z][\w-]*\s*,/i.test(subi) ? "-" + subi : subi.replace(" url "," - ").replace(" url-and-header "," - "))); // phân luồng hỗn hợp cũng cần vô hiệu hoá, hide=0 không thể khôi phục thành quy tắc hợp lệ
                } else if (outflag == 0 && inflag != 0) { //out không khớp && in không bị loại
                    Nlist.push(RuleNoteJoin(noteParts.note, subi));
                } else if (outflag == 2 && inflag != 0) { //không có tham số out && in không bị loại
                    Nlist.push(RuleNoteJoin(noteParts.note, subi));
                }
            }
        }
    }

    if (Pntf0 != 0) {
        nowrite = dwrite.length <= 10 ? emojino[dwrite.length] : dwrite.length
        no1write = Nlist.length <= 10 ? emojino[Nlist.length] : Nlist.length
        if (Pin0 && no1write != " 0️⃣ ") { //có tham số in thì thông báo các mục giữ lại
          if (Pout!=0) {
            $notify("🤖 " + "tham chiếu rewrite  ➟ " + "⟦" + subtag + "⟧", "⛔️ Tham số lọc: " + pfi + pfo, "☠️ Trong rewrite đã giữ lại các mục khớp sau" + no1write + " mục:" + "\n ⨷ " + Nlist.join("\n ⨷ "), rwrite_link)
          }
        } else if (dwrite.length > 0) {
          if (Pout0!=0) {
            $notify("🤖 " + "tham chiếu rewrite  ➟ " + "⟦" + subtag + "⟧", "⛔️ Tham số lọc: " + pfi + pfo, "☠️ Trong rewrite đã vô hiệu hoá các mục khớp sau" + nowrite + " mục:" + "\n ⨷ " + dwrite.join("\n ⨷ "), rwrite_link)
          }
        }
    }

    if (Nlist.length == 0 ) { 
      if ((Pin0 || Pout0 || Phin0 || Phout0 || Pregout || Preg)) {
        $notify("🤖 " + "tham chiếu rewrite  ➟ " + "⟦" + subtag + "⟧", "⛔️ Tham số lọc: " + pfi + pfo, "⚠️ Số quy tắc rewrite còn lại sau khi lọc là 0️⃣, vui lòng kiểm tra tham số và liên kết gốc", nan_link) 
      } else {
        $notify("🤖 " + "tham chiếu rewrite  ➟ " + "⟦" + subtag + "⟧", "⛔️ Số quy tắc rewrite sau khi phân tích là 0️⃣ " , "⚠️ Vui lòng kiểm tra tham số và nội dung liên kết gốc", nan_link) 
      
      }
    }
    if(Preg){ Nlist = Nlist.map(Regex).filter(Boolean) // regex to filter rewrites
      RegCheck(Nlist, "tham chiếu rewrite", "regex", Preg) }
    if(Pregout){ Nlist = Nlist.map(RegexOut).filter(Boolean) // regex to delete rewrites
      RegCheck(Nlist, "tham chiếu rewrite", "regout", Pregout) }
    if (hostname != "") { Nlist.push(hostname) }
    Nlist =Phide ==1? Nlist : [...dwrite,...Nlist]
    //$notify("final","Content",Nlist)
    return Nlist
}

// Xử lý hostname
function HostNamecheck(content, parain, paraout) {
    var hname = content.replace(/ /g, "").split("=")[1].split(",");
    var nname = [];
    var dname = []; //mục xoá
    for (var i = 0; i < hname.length; i++) {
        dd = hname[i]
        const excludehn = (item) => dd.indexOf(item) != -1;
        if (paraout && paraout != "") { //khi có tham số out
            if (!paraout.some(excludehn)) { //out không khớp🎯️
                if (parain && parain != "") {
                    if (parain.some(excludehn)) { //Pin khớp🎯️
                        nname.push(hname[i])
                    } else {
                        dname.push(hname[i])
                    } //ghi lại Pin không khớp🎯️
                } else { nname.push(hname[i]) } //không có tham số in    
            } else { dname.push(hname[i]) } //tham số out khớp
        } else if (parain && parain != "") { //khi không có out nhưng có tham số in
            if (parain.some(excludehn)) { //Pin khớp🎯️
                nname.push(hname[i])
            } else { dname.push(hname[i]) }
        } else {
            nname.push(hname[i])
        }
    } //for j
    if (Pntf0 != 0) {
        if (paraout || parain) {
            var noname = dname.length <= 10 ? emojino[dname.length] : dname.length
            var no1name = nname.length <= 10 ? emojino[nname.length] : nname.length
            if (parain && no1name != " 0️⃣ ") {
                $notify("🤖 " + "Tham chiếu rewrite  ➟ " + "⟦" + subtag + "⟧", "⛔️ Tham số lọc: " + pfihn + pfohn, "☠️ Trong hostname đã giữ lại " + no1name + " mục khớp sau:" + "\n ⨷ " + nname.join(","), rwhost_link)
            } else if (dname.length > 0) {
                $notify("🤖 " + "Tham chiếu rewrite  ➟ " + "⟦" + subtag + "⟧", "⛔️ Tham số lọc: " + pfihn + pfohn, "☠️ Trong hostname đã xóa " + noname + " mục khớp sau:" + "\n ⨷ " + dname.join(","), rwhost_link)
            }
        }
    }
    if (nname.length == 0) {
        $notify("🤖 " + "Tham chiếu rewrite  ➟ " + "⟦" + subtag + "⟧", "⛔️ Tham số lọc: " + pfihn + pfohn, "⚠️ Trong hostname còn lại 0️⃣ mục, vui lòng kiểm tra tham số và link gốc", nan_link)
    }
    if(Preg){ nname = nname.map(Regex).filter(Boolean)
      RegCheck(nname, "Tên máy chủ hostname","regex", Preg) }
    if(Pregout){ nname = nname.map(RegexOut).filter(Boolean)
      RegCheck(nname, "Tên máy chủ hostname", "regout", Pregout) }
    hname = "hostname=" + nname.join(", ");
    return hname
}

//Hàm lọc Rewrite
function Rcheck(content, param) {
    name = content.toUpperCase()
    if (param) {
        var flag = 0; //chưa khớp
        const checkpara = (item) => name.indexOf(item.toUpperCase()) != -1;
        if (param.some(checkpara)) {
            flag = 1 //đã khớp
        }
        return flag
    } else { //if param
        return 2
    } //không có tham số
}

//Chuyển đổi và lọc rule phân luồng (in & out), dùng được cho rule-list của Surge và QuanX
function Rule_Handle(subs, Pout, Pin) {
    cnt = subs //.split("\n");
    Tin = Pin; //tham số giữ lại
    Tout = Pout; //tham số lọc
    ply = Ppolicy; //nhóm policy
    var nlist = []
    var ignored = []
    var RuleK = ["//", "#", ";","[","^"]; //các mục loại trừ
    var RuleK2 = ["host,", "-suffix,", "domain,", "-keyword,", "ip-cidr,", "ip-cidr6,",  "geoip,", "user-agent,", "ip6-cidr,", "ip-asn"];
    //$notify("nlist-s0","",subs)
    if (Tout != "" && Tout != null) { // Khi có tham số out
        var dlist = [];
        for (var i = 0; i < cnt.length; i++) {
            cc = cnt[i].replace(/^\s*\-\s/g,"").trim()
            //$notify("out ing", Tout, cc)
            const exclude = (item) => RuleNoteBody(cc).indexOf(item) != -1; // mục cần xóa
            const RuleCheck = (item) => cc.toLowerCase().indexOf(item) != -1; //kiểm tra rule
            const CommentCheck = (item) => RuleNoteBody(cc).toLowerCase().indexOf(item) == 0; //bỏ qua dòng chú thích
            if (Tout.some(exclude) && !RuleK.some(CommentCheck) ) {
              // 2022-12-15: bỏ điều kiện kiểm tra && RuleK2.some(RuleCheck) để tránh áp dụng lên tham số trong list/provider
                dlist.push(RuleNoteMap(Rule_Policy(cc, ignored), body => body ? "-" + body : "")) // chú thích phần nội dung chính, phần giải thích vẫn giữ theo mục gốc
            } else if (!RuleK.some(CommentCheck) && cc ) { //if Pout.some, không xử lý dòng chú thích, không xử lý rule không nhận dạng được
              // 2022-12-15: bỏ điều kiện kiểm tra && RuleK2.some(RuleCheck) để tránh áp dụng lên tham số trong list/provider
                dd = Rule_Policy(cc, ignored);
                if (Tin != "" && Tin != null) {
                    const include = (item) => RuleNoteBody(dd).indexOf(item) != -1; // mục cần giữ lại
                    if (Tin.some(include)) {
                        nlist.push(dd);
                    }
                } else {
                    nlist.push(dd);
                }
            } //else if cc
        }//for cnt
        var no = dlist.length <= 10 ? emojino[dlist.length] : dlist.length
        if (dlist.length > 0) {
            if (Pntf0 != 0) { $notify("🤖 " + "Tham chiếu phân luồng  ➟ " + "⟦" + subtag + "⟧", "⛔️ Đã vô hiệu hóa: " + Tout, "☠️ Đã vô hiệu hóa các rule khớp sau: " + no + " rule khớp:" + "\n ⨷ " + dlist.join("\n ⨷ "), rule_link) }
        } else { $notify("🤖 " + "Tham chiếu phân luồng  ➟ " + "⟦" + subtag + "⟧", "⛔️ Đã vô hiệu hóa: " + Tout, "⚠️ Không tìm thấy mục khớp nào, vui lòng kiểm tra tham số hoặc link gốc", nan_link) }
        if (Tin != "" && Tin != null) {  //Khi có cả tham số in và out
            if (nlist.length > 0) {
                var noin0 = nlist.length <= 10 ? emojino[nlist.length] : nlist.length
                if (Pntf0 != 0) {
                    $notify("🤖 " + "Tham chiếu phân luồng  ➟ " + "⟦" + subtag + "⟧", "✅ Đã giữ lại:" + Tin, "🎯 Đã giữ lại các rule khớp sau: " + noin0 + " rule khớp:" + "\n ⨁ " + nlist.join("\n ⨁ "), rule_link)
                }
            } else {
                $notify("🤖 " + "Tham chiếu phân luồng  ➟ " + "⟦" + subtag + "⟧", "✅ Đã giữ lại:" + Tin + ",⛔️ Đã vô hiệu hóa: " + Tout, "⚠️ Sau khi lọc còn lại 0️⃣ rule, vui lòng kiểm tra tham số và link gốc", nan_link)
            }
        } else {// if Tin (No Tin)
            if (nlist.length == 0) {
                $notify("🤖 " + "Tham chiếu phân luồng  ➟ " + "⟦" + subtag + "⟧", "⛔️ Đã vô hiệu hóa: " + Tout, "⚠️ Sau khi lọc còn lại 0️⃣ rule, vui lòng kiểm tra tham số và link gốc", nan_link)
            }
        }
      nlist =Phide ==1? nlist : [...dlist,...nlist]
        //return nlist;
    } else if (Tin != "" && Tin != null) { //if Tout
        var dlist = [];
        for (var i = 0; i < cnt.length; i++) {
            cc = cnt[i].replace(/^\s*\-\s/g,"").trim()
            const RuleCheck = (item) => cc.indexOf(item) != -1; //bỏ qua dòng chú thích
            const CommentCheck = (item) => RuleNoteBody(cc).toLowerCase().indexOf(item) == 0; //bỏ qua dòng chú thích
            if (!RuleK.some(CommentCheck) && cc) { //if Pout.some, không xử lý dòng chú thích
                dd = Rule_Policy(cc, ignored);
                const include = (item) => RuleNoteBody(dd).indexOf(item) != -1; // mục cần giữ lại
                if (Tin.some(include)) {
                    nlist.push(dd);
                } else { dlist.push(RuleNoteMap(dd, body => body ? "-" + body : "")) }
            }
        } // for cnt
        if (nlist.length > 0) {
            var noin = nlist.length <= 10 ? emojino[nlist.length] : nlist.length
            if (Pntf0 != 0) {
                $notify("🤖 " + "Tham chiếu phân luồng  ➟ " + "⟦" + subtag + "⟧", "✅ Đã giữ lại:" + Tin, "🎯 Đã giữ lại các rule khớp sau: " + noin + " rule khớp:" + "\n ⨁ " + nlist.join("\n ⨁ "), rule_link)
            }
        } else { $notify("🤖 " + "Tham chiếu phân luồng  ➟ " + "⟦" + subtag + "⟧", "✅ Đã giữ lại:" + Tin, "⚠️ Sau khi lọc còn lại 0️⃣ rule, vui lòng kiểm tra tham số và link gốc", nan_link) }
      nlist =Phide ==1? nlist : [...dlist,...nlist]
      //return nlist;
    } else {  //if Tin
      nlist = cnt.map(function (row) { return Rule_Policy(row, ignored) })
        //return cnt.map(Rule_Policy)
    }
  nlist = nlist.filter(item => item && item != "-") // Khi hide=0, loại bỏ dòng vô hiệu hóa trống do rule không hỗ trợ để lại
  nlist = Pfcr == 1? nlist.filter(Boolean).map(item => item+", force-cellular") : nlist.filter(Boolean)
  nlist = Pfcr == 2? nlist.filter(Boolean).map(item => item+", multi-interface") : nlist.filter(Boolean)
  nlist = Pfcr == 3? nlist.filter(Boolean).map(item => item+", multi-interface-balance") : nlist.filter(Boolean)

  if (Pvia!="") {
    nlist = Pvia ==0? nlist.filter(Boolean).map(item => item+", via-interface=%TUN%") : nlist.filter(Boolean).map(item => item+", via-interface="+Pvia)
  }

  nlist=nlist.map(item=>RuleNoteMap(item, body => body.replace(/:\d*\s*,/g,",").replace(/(\'|\")/g,"").replace(/(\-suffix|\-SUFFIX)\s*\,\s*\./g,"$1, "))) // Dọn dẹp phần nội dung chính của rule, không sửa dấu ngoặc kép, cổng... trong phần giải thích
  NotifyUnsupportedRules(ignored)
  //$notify("nlist","",nlist)
  return nlist
}

function Rule_Policy(content, ignored) { //Thêm, thay thế policy
    var noteParts = RuleNoteSplit(content);
    if (noteParts.note) {
        var failureStart = Array.isArray(ignored) ? ignored.length : 0;
        var converted = Rule_Policy(noteParts.body, ignored);
        if (Array.isArray(ignored)) {
            for (var n = failureStart; n < ignored.length; n++) { ignored[n].rule = RuleNoteJoin(noteParts.note, ignored[n].rule) }
        }
        return RuleNoteJoin(noteParts.note, converted);
    }
    function skip(reason) {
        if (Array.isArray(ignored) && /^[a-z][\w-]*\s*,/i.test(content.trim())) { ignored.push({rule: content, reason: reason}) }
        return "";
    }
    if (/^(?:AND|OR|NOT)\s*,/i.test(content.trim())) { return skip("Rule kết hợp logic không thể chuyển đổi trực tiếp, tách ra sẽ làm thay đổi điều kiện khớp") }
    if (/^URL-REGEX\s*,/i.test(content.trim())) { return skip("URL-REGEX cần được import dưới dạng tài nguyên rewrite, không phải cú pháp phân luồng của Quantumult X") }
    var cnt = content.replace(/^\s*\-\s/g,"").replace(/REJECT-TINYGIF/gi,"reject").replace(/REJECT-DROP/gi,"reject").trim().split("//")[0].trim().split(",");
    // ⟦2026-09-16 11:55 +08⟧ Các flag bổ sung đã biết của Surge được loại bỏ theo từng trường, không còn phụ thuộc vị trí; giữ lại điều kiện khớp chính và policy.
    // QX không tái hiện giai đoạn pre-matching hay cơ chế extended-matching của Surge; tham số không rõ không tự ý xóa.
    cnt = cnt.map(function (part) { return part.trim() });
    if (/^(?:domain(?:-suffix|-keyword|-wildcard|-regex)?|host(?:-suffix|-keyword|-wildcard)?|ip-cidr6?|ip6-cidr|ip-asn|geoip|user-agent)$/i.test(cnt[0])) {
        cnt = cnt.slice(0, 2).concat(cnt.slice(2).filter(function (part) { return !/^(?:no-resolve|pre-matching|extended-matching)$/i.test(part) }));
        if (cnt[1]) { cnt[1] = cnt[1].replace(/^(["'])([\s\S]*)\1$/, "$2") }
    }
    // Ghi chú sửa DOMAIN-REGEX ⟦2026-09-10 11:23:07 +08⟧
    // Regex tên miền đơn giản được chuyển thành host-wildcard: .* -> *, . -> ?, \. -> ., giữ biên ^/$; cú pháp phức tạp sẽ được nhắc bỏ qua.
    if (/^domain-regex$/i.test(cnt[0].trim())) {
        var pattern = (cnt[1] || "").trim();
        if (!/^\^?(?:[a-z0-9_-]|\\\.|\.\*?)+\$?$/i.test(pattern)) {
            if (Array.isArray(ignored)) { return skip("DOMAIN-REGEX chứa regex phức tạp hoặc không hợp lệ, không thể chuyển thành host-wildcard") }
            $notify("⚠️ DOMAIN-REGEX không thể chuyển thành rule ký tự đại diện của Quantumult X", "Đã bỏ qua regex phức tạp hoặc không hợp lệ này, các rule còn lại vẫn tiếp tục xử lý", content);
            return "";
        }
        var wildcard = pattern.replace(/^\^|\$$/g, "").replace(/\\\.|\.\*|\./g, token => token == "\\." ? "." : token == ".*" ? "*" : "?");
        cnt[0] = "host-wildcard";
        cnt[1] = ((pattern[0] == "^" ? "" : "*") + wildcard + (pattern.slice(-1) == "$" ? "" : "*")).replace(/\*+/g, "*");
    }
    var RuleK = ["//", "#", ";","[","/", "hostname","no-ipv6","no-system","<","{","}","]","^"];
    var RuleK1 = ["host", "host-suffix", "host-keyword", "host-wildcard", "domain", "domain-suffix", "domain-keyword", "domain-wildcard", "ip-cidr", "ip-cidr6", "geoip", "user-agent", "ip6-cidr", "ip-asn"];
    const RuleCheck = (item) => cnt[0].trim().toLowerCase().indexOf(item) == 0; //bỏ qua dòng chú thích
    const RuleCheck1 = (item) => cnt[0].trim().toLowerCase() == item; // Loại phải khớp đầy đủ, không được xuất DOMAIN-* không rõ thành HOST-*
    if (RuleK1.some(RuleCheck1) && !RuleK.some(RuleCheck) ) {
        if (!cnt[1] || (cnt.length > 2 && !cnt[2])) { return skip("Phân luồng thiếu nội dung khớp hoặc policy hợp lệ") }
        if (cnt.length == 3 && cnt.indexOf("no-resolve") == -1) {
            ply0 = Ppolicy != "Shawn" ? Ppolicy : cnt[2]
            nn = cnt[0] + ", " + cnt[1] + ", " + ply0
        } else if (cnt.length == 4 && cnt.indexOf("no-resolve") != -1) { // rule dạng QuanX có no-resolve
          nn = cnt.join(",").replace(",no-resolve","")
        } else if (cnt.length == 2) { //Surge rule-set
            ply0 = Ppolicy != "Shawn" ? Ppolicy : "Shawn"
            nn = cnt[1].trim() !=""? cnt[0] + ", " + cnt[1] + ", " + ply0 : ""
        } else if (cnt.length == 3 && cnt[2].indexOf("no-resolve") != -1) {
            ply0 = Ppolicy != "Shawn" ? Ppolicy : "Shawn"
            nn = cnt[0] + ", " + cnt[1] + ", " + ply0 //+ ", " + cnt[2]
        } else if (cnt.length == 4 && cnt[3].indexOf("no-resolve") != -1) {
            ply0 = Ppolicy != "Shawn" ? Ppolicy : cnt[2]
            nn = cnt[0] + ", " + cnt[1] + ", " + ply0 //+ ", " + cnt[3]
        } else if (!RuleK.some(RuleCheck) && content) {
            //$notify("Không phân tích được" + "⟦" + subtag + "⟧" + "một số rule trong đó:", content, nan_link);
            return skip("Số lượng tham số phân luồng hoặc tham số bổ sung không nhận dạng được, chưa tự ý xóa điều kiện không rõ")
        } else { return "" }
        if (cnt[0].indexOf("URL-REGEX") != -1 || cnt[0].indexOf("PROCESS") != -1) {
            nn = ""
        } else { 
          nn = nn.replace(/^ip-cidr6/i, "ip6-cidr").replace(/^domain/i,"host")
        }
        return nn
    } else if (cnt.length == 1 && !RuleK.some(RuleCheck) && cnt[0]!="" && cnt[0].indexOf("payload:")==-1 && cnt[0].indexOf("=")==-1 && cnt[0].trim()!="https:") { // danh sách tên miền/IP thuần
      //$notify("LIST-HANDLE")
      return rule_list_handle(cnt[0])
    } else { 
      //$notify("Nothing")
      return skip("Trình phân tích hiện tại không có cách chuyển đổi đáng tin cậy cho loại phân luồng này") }//if RuleK1 check 
}

// Xử lý danh sách thuần, bao gồm clash-provider
function rule_list_handle(cnt) {
  var noteParts = RuleNoteSplit(cnt);
  if (noteParts.note) { return RuleNoteJoin(noteParts.note, rule_list_handle(noteParts.body)) }
  if (/^[ \t]*\{#/.test(cnt)) { return "" } // Phần giải thích chưa đóng nên không được chuyển nhầm thành tên miền “{”.
  var RuleK = ["//", "#", ";", "[", "!", "/"]
  const RuleCheck = (item) => cnt.trim().indexOf(item) == 0; //bỏ qua dòng chú thích
  const nocheck = (item) => /^\d+$/.test(item) //kiểm tra mục số
  cnt = cnt.split("#")[0].trim() // loại bỏ phần chú thích
  if (cnt.trim().indexOf(" ") == -1 && cnt.trim() != "" && !RuleK.some(RuleCheck)) {
    if (cnt.indexOf("::") != -1 && cnt.indexOf("/") != -1) { // ip-v6?
      cnt = "ip6-cidr, " + cnt
      cnt = Ppolicy == "Shawn" ? cnt + ", Shawn" : cnt + ", " + Ppolicy
    } else if (cnt.split("/").length == 2) {//ip-cidr
      cnt = "ip-cidr, " + cnt
      cnt = Ppolicy == "Shawn" ? cnt + ", Shawn" : cnt + ", " + Ppolicy
    } else if (cnt.split(".").length == 4 && cnt.split(".").every(nocheck)) {  // rule dạng IP
      cnt = "ip-cidr, " + cnt + "/32"
      cnt = Ppolicy == "Shawn" ? cnt + ", Shawn" : cnt + ", " + Ppolicy
    } else if (cnt.indexOf("payload:") == -1) { //host - suffix, not clash rule list
      //$notify("xxx","xxxx",cnt)
      //cnt=cnt.replace(/'|"/g,"").trim()//replace(/'|"|\+\.|\*\.|\*\.\*/g,"") 2023-04-10

      if (!/^('|")/.test(cnt)) { // not clash-provider
        if (!/\*|\+/.test(cnt[0])) {
          cnt = cnt[0] == "." ? cnt.replace(".", "") : cnt
          cnt = "host-suffix, " + cnt
        } else {
          cnt = "host-wildcard, " + cnt
        }
      } else { // clash provider
        cnt = cnt.replace(/'|"/g, "").trim()

        if (/^\.|\*\./.test(cnt) || cnt.indexOf("*") != -1) {
          //1. Bắt đầu bằng . hoặc *. -> khớp tên miền con, wildcard, *.domain
          //2. Thay trực tiếp phần đầu, regex không khớp -> trường hợp chuỗi không bắt đầu bằng *. nhưng chứa * (wildcard, a.*.domain...)
          cnt = "host-wildcard, " + cnt.replace(/^\.|\*\./, "*.")
        } else {
          cnt = "host-suffix, " + cnt.replace(/^(\+\.)/, "")//Nếu bắt đầu bằng +. = khớp tên miền hiện tại và các tên miền con của nó, dùng suffix,domain.
        }
      }
      cnt = Ppolicy == "Shawn" ? cnt + ", Shawn" : cnt + ", " + Ppolicy
    }
  }
  return cnt
}

// Domain-Set
function Domain2Rule(content) {
    var cnt = content.split("\n");
    var RuleK = ["//", "#", ";","["]
    var nlist = []
    for (var i = 0; i< cnt.length; i++) {
        var noteParts = RuleNoteSplit(cnt[i].trim());
        cc = noteParts.body;
        const RuleCheck = (item) => cc.indexOf(item) != -1; //bỏ qua dòng chú thích
        if(!RuleK.some(RuleCheck) && cc) {
            if (cc[0] == "."){
                nlist.push(RuleNoteJoin(noteParts.note, "host-suffix, " + cc.slice(1 , cc.length)))
            } else {
                nlist.push(RuleNoteJoin(noteParts.note, "host, " + cc))
            }
        }
    }
    return nlist.join("\n")
}
// filter: thay thế theo regex chỉ định regex1@policy1+regex2@policy2
function policy_sets(cnt,para) {
  pcnt = para.split("+")
  cnt=cnt//.split("\n")
  for (i=0;i<pcnt.length;i++){
    console.log(pcnt[i])
    if (pcnt[i].indexOf("@")!=-1){
      cnt = cnt.map(item => filter_set(item, pcnt[i]))
    }
  }
  cnt=cnt.filter(Boolean)//.join("\n")
  return cnt
  console.log(cnt)
}

//Chỉ định policy
function filter_set(cnt,para){
  var noteParts = RuleNoteSplit(cnt);
  if (noteParts.note) { return RuleNoteJoin(noteParts.note, filter_set(noteParts.body, para)) }
  if (cnt){
    paras=[para.split("@")[0],para.slice(para.split("@")[0].length+"@".length)]
    console.log(para.split("@")[0].length+"@".length,paras)
    cnt = cnt.split(",")
    reg = RegExp(paras[0])
    console.log(paras,cnt)
    if(cnt.length == 3){
      if (reg.test(cnt[1]) || reg.test(cnt[2])) {
        cnt[2] = paras[1]
      }
    }
    return cnt.join(",")
  }
}


// Thay thế bằng regex cho phần filter/rewrite
// Công dụng: ví dụ đổi vùng TikTok: JP -> KR, ví dụ script so sánh giá Taobao -> bản thông báo banner lite
function ReplaceReg(cnt, para) {
    var cnt0 = cnt//.join("\n")
    //$notify("0","",cnt0)
    var pp = para.replace(/\\\@/g,"atsymbol").replace(/\\\+/g,"plussymbol").split("+");
    for (var i = 0; i < pp.length; i++) {
        var p1 = decodeURIComponent(pp[i].split("@")[0]).replace(/atsymbol/g,"\@").replace(/plussymbol/g,"\\\+").replace(/\，/g,",");
        var p2 = decodeURIComponent(pp[i].split("@")[1]).replace(/atsymbol/g,"@").replace(/plussymbol/g,"+").replace(/\，/g,",");
        p1 = new RegExp(p1, "gmi");
        cnt0 = cnt0.map(item => flag == 2 || flag == 3 ? RuleNoteMap(item, body => body.replace(p1, p2)) : item.replace(p1, p2));
        //$notify(p1,p2,cnt0)
    }
  //$notify("1","",cnt0)
    return cnt0//.split("\n")
}


// read parameters 2026-05-17
function param(res,org,mbody) {
  if(mbody.indexOf(org)!=-1) {
    tmp=mbody.split(org)[1].split("&")[0].split("#")[0].replace(/\s/,"")
    tmp = tmp!=""? res+"="+tmp : ""
    return tmp
  }
  else return ""
}

// get reality parameters
function Reality_Handle(cnt) {
//add reality-base64-pubkey, reality-hex-shortid, vless-flow=xtls-rprx-vision
  a1=param("reality-base64-pubkey","pbk=",cnt)
  a2=param("reality-hex-shortid","sid=",cnt)
  a3=(cnt.indexOf("flow=xtls-rprx-vision")!=-1 || cnt.indexOf("xtls=2")!=-1)? "vless-flow=xtls-rprx-vision": ""
  rnt=[a1,a2,a3].filter(Boolean).join(", ")
  return rnt
}


//Các loại subscription hỗn hợp, dùng cho loại chưa được base64 encode toàn bộ và loại đã decode
function Subs2QX(subs, Pudp, Ptfo, Pcert0, PTls13) {
  if (Pdbg) {$notify("subs", "node", subs)}
    var list0 = subs.split("\n");
    var QuanXK = ["shadowsocks=", "trojan=", "vmess=", "http=","socks5=", "vless=", "anytls="];
    var SurgeK = ["=ss,", "=vmess,", "=trojan,", "=http,", "=https,", "=custom,", "=socks5", "=socks5-tls","=anytls"];
    var LoonK = ["=Shadowsocks", "=ShadowsocksR", "=Trojan", "=VLESS","=AnyTLS"]
    var QXlist = [];
    var failedList = [];
    for (var i = 0; i < list0.length; i++) {
        var node = ""
        //if (Pdbg) {$notify(i, "node", list0[i])}
        if (list0[i].trim().length > 3 && !/\;|\/|\#/.test(list0[i][0]) && list0[i].indexOf(" url ")==-1) {
            var type = list0[i].split("://")[0].trim()
            var listi = list0[i].replace(/ /g, "")
            var tag0 = list0[i].indexOf("tag=")!=-1 ? list0[i].split(/\&*(emoji|udp|tfo|cert|rename|replace)\=/)[0].split("tag=")[1] : ""
            list0[i] = (type=="ssr") ? list0[i].split(/#|,|，/)[0] : list0[i] // 2023-04-18 remove type == "vmess" ||
            const NodeCheck = (item) => listi.toLowerCase().indexOf(item) != -1;
            const NodeCheck1 = (item) => listi.toLowerCase().indexOf(item) == 0;
            const NodeCheck2 = (item) => listi.indexOf(item) != -1;
            try {
              if (Pdbg) {$notify(i, type, list0[i])}
                if (type == "vmess" && (list0[i].indexOf("remark=") == -1 && list0[i].indexOf("remarks=") == -1) && !/(obfs|alterId|type|\@)\=/.test(list0[i])) {
                    var bnode = Base64.decode(list0[i].split("vmess://")[1])
                    if (bnode.indexOf("over-tls=") == -1) { //v2rayN
                        node = V2QX(list0[i], Pudp, Ptfo, Pcert0, PTls13)
                    } else { //dạng Quantumult
                        node = VQ2QX(list0[i], Pudp, Ptfo, Pcert0, PTls13)
                    }
                  node = tag0 != "" ? URI_TAG(node, tag0) : node
                } else if (type == "vmess" && ( list0[i].indexOf("remark=") != -1 || list0[i].indexOf("remarks=") != -1 || /(obfs|alterId|type|\@)\=/.test(list0[i]))) { //dạng Shadowrocket
                    node = VR2QX(list0[i], Pudp, Ptfo, Pcert0, PTls13)
                    node = tag0 != "" ? URI_TAG(node, tag0) : node
                } else if (type == "socks" && list0[i].indexOf("remarks=") != -1) { //dạng socks5 Shadowrocket
                    node = S5R2QX(list0[i])
                    node = tag0 != "" ? URI_TAG(node, tag0) : node
                } else if (type == "ssocks" && list0[i].indexOf("remarks=") != -1) { //dạng socks5-tls Shadowrocket
                    node = S5R2QX(list0[i],tlsp="over-tls")
                    node = tag0 != "" ? URI_TAG(node, tag0) : node
                } else if (type == "socks" && list0[i].indexOf("remarks=") == -1) { // socks URI 2026-05-25
                    node = Socks2QX(list0[i])
                    node = tag0 != "" ? URI_TAG(node, tag0) : node
                } else if (type == "ssr") {
                    node = SSR2QX(list0[i], Pudp, Ptfo)
                    node = tag0 != "" ? URI_TAG(node, tag0) : node
                } else if (type == "ss") {
                    node = SS2QX(list0[i], Pudp, Ptfo)
                    node = tag0 != "" ? URI_TAG(node, tag0) : node
                } else if (type == "ssd") {
                    node = SSD2QX(list0[i], Pudp, Ptfo)
                } else if (type == "trojan") {
                    node = TJ2QX(list0[i], Pudp, Ptfo, Pcert0, PTls13)
                    node = tag0 != "" ? URI_TAG(node, tag0) : node
                } else if ((type == "https" || type == "http") && list0[i].indexOf(",") == -1) {
                    if (listi.indexOf("@") != -1) {
                        node = HPS2QX(list0[i], Ptfo, Pcert0, PTls13)
                        node = tag0 != "" ? URI_TAG(node, tag0) : node
                    } else { // dạng b64 http/https
                        var listh = Base64.decode(listi.split(type+"://")[1].split("#")[0].split("?")[0])
                        listh = list0[i].replace(listi.split(type+"://")[1].split("#")[0].split("?")[0],listh) //type+"://" + listh + "#" + listi.split(type+"://")[1].split("#")[1]
                        node = HPS2QX(listh, Ptfo, Pcert0, PTls13)
                        node = tag0 != "" ? URI_TAG(node, tag0) : node
                    }
                } else if (type == "vless" && version<821) {
                  Perror = 1 ; // không cần phản hồi
                } else if (type == "vless" ) { // version 150 support vless 
                  node=VL2QX(list0[i], Pudp, Ptfo, Pcert0, PTls13)
                } else if (type == "anytls") { // 2026-04-15: hỗ trợ dạng TLS
                  if (version <914) {
                    Perror = 1 ; // không cần phản hồi
                  } else {
                    node=Anytls2QX(list0[i],Pcert0)
                  }
                } else if (QuanXK.some(NodeCheck1)) { // QuanX type 
                    node = QX_TLS(isQuanX(list0[i])[0], Pcert0, PTls13)
                } else if (LoonK.some(NodeCheck2)) { // Loon type
                    node = Loon2QX(list0[i])
                } else if (SurgeK.some(NodeCheck) ) { // dạng Surge, trường thứ 2 là số cổng
                    node = QX_TLS(Surge2QX(list0[i])[0], Pcert0, PTls13)
                } else if (type=="hysteria2" || type=="hy2" || (type=="anytls" && version<914) || type=="tuic" || type=="wireguard"|| type=="wg") { // hy2 và hysteria2 dùng chung thông báo không hỗ trợ
                  PNS=PNS+1 
                  NSList.push(numToEmoji10(PNS)+list0[i])
                } else if (/^STATUS\=/.test(listi)) { // flow info fake server
                  //$notify("Status","flow",listi)
                  Rocket_flow(listi)
                }
              if (Pdbg) {$notify(i, type, node)}
            } catch (e) {
                failedList.push(`<<<\nContent: ${list0[i]}\nError: ${e}`)
            }
            if (Paead != "") {node = AeadVmess(node,Paead)} // xử lý aead cho dạng vmess
            if (Phost != "") {node = HOST_Handle(node,Phost)} // sửa tham số host
            if (Pobfs != "") {node = OBFS_Handle(node,Pobfs)} // sửa tham số obfs
            if (Psession != "") { node = Session_Handle(node,Psession)} // tham số tls-session
            if (Pcsha256 != "" || Ppsha256 != "") {
            node = SHA256_Handle(node,Pcsha256,Ppsha256)} // Tham số Sha256
            if (Palpn !="") { node = ALPN_Handle(node,Palpn)} // tham số alpn
            node = TLS_Check(node)
            //if (Pdbg) {$notify("Final", type, node)}
            if (node instanceof Array) {
                for (var j in node) {
                  node[j] = Pudp != 0 ? XUDP(node[j],Pudp) : node[j]
                  node[j] = Ptfo != 0 ? XTFO(node[j],Ptfo) : node[j]
                    QXlist.push(node[j])
                }
            } else if (node != ""  && node) {
              node = Pudp != 0 ? XUDP(node,Pudp) : node
              node = Ptfo != 0 ? XTFO(node,Ptfo) : node
                QXlist.push(node)
            }
        }
    }
    if (failedList.length > 0 && Pntf0 != 0) {
        $notify(`⚠️ Có ${failedList.length} mục dữ liệu phân tích thất bại, đã bỏ qua`, "Nội dung lỗi👇", failedList.join("\n"));
    }
    //$notify("QXList","check below content",QXlist)
    return QXlist;
}

// Vmess Aead: tắt - mặc định bật
function AeadVmess(cnt,aeadp) {
  let paead = aeadp == -1? "aead=false" : "aead=true" 
  if (/^vmess\s*\=/.test(cnt)) {
    if (/aead\s*\=/.test(cnt)) {
      cnt = cnt.replace(/aead\s*\=.*\,/,paead+",")
    } else {
      cnts = cnt.split(",")
      cnts.push(paead)
      //console.log(cnts)
      cnt=cnts.join(", ")
    }

  }
  return cnt
}

//Kiểm tra TLS phiên bản mới (khi có tham số sha256)
function TLS_Check(cnt) {
  cnt =cnt.indexOf("tls-cert-sha256")!=-1 || cnt.indexOf("tls-pubkey-sha256")!=-1 ? cnt.replace(/tls-verification\s*\=\s*false.*?\,/,"tls-verification=true,"): cnt // bỏ tls-verification=false nếu có sha256
  return cnt
}

// Vấn đề xác minh TLS/UDP dạng QX
function QX_TLS(cnt,Pcert0,PTls13) {
  cnt =cnt.replace(/tag\s*\=/gm,"tag=") //
  var cert0 = TLSCertParam(Pcert0, "false") + ", "
  var tls13 = PTls13 == 1? "tls13=true, " : ""
  if(cnt.indexOf("tls-verification") != -1){ // Khi đã có tham số TLS, nếu người dùng không chỉ định thì không xử lý
    cnt = TLSCertDomainValue(Pcert0) !== "" ? cnt.replace(RegExp("tls\-verification.*?\,", "gmi"), cert0): cnt
    //cnt = Pcert0 == 1? cnt.replace(RegExp("tls\-verification.*?\,", "gmi"), cert0): cnt
  } else if(cnt.indexOf("obfs=over-tls")!=-1 || /over\-tls\s*\=\s*true/.test(cnt) || cnt.indexOf("obfs=wss")!=-1){ //Khi chưa có tham số TLS
    cnt = cnt.replace(new RegExp("tag\s*\=", "gmi"), cert0+"tag=")
  }
  if (tls13 !="") {
  if(cnt.indexOf("tls13") != -1){
    cnt = cnt.replace(RegExp("tls13.*?\,", "gmi"), tls13)
  } else if(cnt.indexOf("obfs=over-tls")!=-1 || /over\-tls\s*\=\s*true/.test(cnt) || cnt.indexOf("obfs=wss")!=-1){
    cnt = cnt.replace(new RegExp("tag\s*\=", "gmi"), tls13+"tag=")
  }
  }
  if (!/^(shadowsocks|trojan|vmess|vless|anytls)/.test(cnt.trim())) { //tắt UDP cho các dạng không phải ss/ssr/trojan/vmess/vless
    udp =  "udp-relay=false, "
    if(cnt.indexOf("udp-relay") != -1){
      var cnt = cnt.replace(RegExp("udp\-relay.*?\,", "gmi"), udp)
    }else{
      var cnt = cnt.replace(new RegExp("tag\s*\=", "gmi"), udp+"tag=")
    }
  }
  return cnt
}

//Chuyển subscription định dạng SIP008 thành định dạng QuanX
function SIP2QuanX (cnt) {
  cnt = JSON.parse(cnt)
  ll =cnt.length
  nodes =[]
  for (i=0; i<ll; i++) {
    node = "shadowsocks= "
    cnti = cnt[i]
    ip = cnti.server + ":" + cnti.server_port
    mtd = "method=" + cnti.method
    pwd = "password=" + cnti.password
    obfs = cnti.plugin_opts? cnti.plugin_opts.replace(";", ", "):""
    tag = "tag="+cnti.remarks
    node = node +[ip,pwd, mtd, obfs, tag].filter(Boolean).join(", ")
    nodes.push(node)
  }
  return nodes.join("\n")
  //console.log(nodes)
}

//http=example.com:443, username=name, password=pwd, over-tls=true, tls-host=example.com, tls-verification=true, tls13=true, fast-open=false, udp-relay=false, tag=http-tls-02
//Chuyển URI dạng HTTPS thành định dạng QUANX
function HPS2QX(subs, Ptfo, Pcert0, PTls13) {
    var type = subs.indexOf("https://")!=-1? "https" : "http" 
    var server = subs.replace("https://", "").replace("http://", "").trim()//Base64.decode(subs.replace("https://", "")).trim().split("\u0000")[0];
    var nss = []
    if (server != "") {
      if (server.indexOf("@")!=-1) {
        var ipport = "http=" + server.split("@")[1].split("#")[0].split("/")[0].split("?")[0];
        var uname = "username=" + server.split(":")[0];
        var pwd = "password=" + server.split("@")[0].split(":")[1];
      } else {
        var ipport = server.split("#")[0].indexOf(":")==-1? "http=" + Base64.decode(server.split("#")[0].split("?")[0]) : "http=" + server.split("#")[0].split("?")[0]; // https://b64(ipport)
      }
        var tag = "tag=" + decodeURIComponent(server.split("#")[1]);
        var tls = type == "https"? "over-tls=true": "";
        var thost = subs.indexOf("peer=")!= -1? "tls-host=" + subs.split("peer=")[1].split("#")[0].split("&")[0] : "" // Khi có tham số peers: https://b64(ipport)?peer=xxx#server-remarks
        var cert = TLSCertParam(Pcert0, "false");
        var tfo = Ptfo == 1 ? "fast-open=true" : "fast-open=false";
        var tls13 = PTls13 == 1 ? "tls13=true" : "tls13=false";
        if (tls=="") {
          cert=""
          tls13=""
        }
        nss.push(ipport, uname, pwd, tls, thost, cert, tfo, tls13, tag)
    }
    var QX = nss.filter(Boolean).join(",");
    return QX
}

//Chuyển đổi URI vmess định dạng Quantumult
function VQ2QX(subs, Pudp, Ptfo, Pcert0, PTls13) {
  var server = String(Base64.decode(subs.replace("vmess://", "").trim()).split("\u0000")[0])
  var node = ""
  var ip = "vmess=" + server.split(",")[1].trim() + ":" + server.split(",")[2].trim() + ", " + "method=aes-128-gcm, " + "password=" + server.split(",")[4].split("\"")[1] + ", "
  var tag = "tag=" + server.split("=")[0]
  var tfo = subs.indexOf("tfo=1") != -1 ? "fast-open=true, " : "fast-open=false, "
  var udp = Pudp == 1 ? "udp-relay=false, " : "udp-relay=false, "; // không hỗ trợ UDP cho dạng vmess
  node = ip + tfo + udp
  var obfs = ""
  if (server.indexOf("obfs=") == -1) { // dạng không phải ws/http
    obfs = server.indexOf("over-tls=true") != -1 ? "obfs=over-tls, " : "" //over-tls
    var host = server.indexOf("tls-host") != -1 ? "obfs-host=" + server.split("tls-host=")[1].split(",")[0] + ", " : ""
    obfs = obfs + host
  } else if (server.indexOf("obfs=ws") != -1) {
    obfs = server.indexOf("over-tls=true") != -1 ? "obfs=wss, " : "obfs=ws, " //dạng ws, wss
    var uri = server.indexOf("obfs-path=") != -1 ? "obfs-uri=" + server.split("obfs-path=")[1].split("\"")[1] + ", " : "obfs-uri=/, "
    obfs = obfs + uri
    var host = server.indexOf("obfs-header=") != -1 ? "obfs-host=" + server.split("obfs-header=\"Host:")[1].split("[")[0].trim() + ", " : ""
    obfs = obfs + host
  } else if (server.indexOf("obfs=http") != -1) {
    obfs = "obfs=http, "
    var uri = server.indexOf("obfs-path=") != -1 ? "obfs-uri=" + server.split("obfs-path=")[1].split("\"")[1] + ", " : "obfs-uri=/, "
    obfs = obfs + uri
    var host = server.indexOf("obfs-header=") != -1 ? "obfs-host=" + server.split("obfs-header=\"Host:")[1].split("[")[0].trim() + ", " : ""
    obfs = obfs + host
  }
  if (obfs.indexOf("obfs=over-tls") != -1 || obfs.indexOf("obfs=wss") != -1) {
    var cert = TLSCertParam(Pcert0, subs.indexOf("allowInsecure=1") != -1 ? "false" : "true") + ", "
    var tls13 = PTls13 == 1 ? "tls13=true, " : ""
    obfs = obfs + cert + tls13
  }
  node = node + obfs + tag
  return node
}


//Chuyển đổi URI vmess định dạng Shadowrocket
function VR2QX(subs, Pudp, Ptfo, Pcert0, PTls13) {
  var server = String(Base64.decode(subs.replace("vmess://", "").split("?remark")[0].split("&remark")[0].split("?")[0]).trim()).split("\u0000")[0]
  if(Pdbg==1) {$notify("Shadowrocket-Vmess-URI","..",subs+"\n\n"+server)}
  if (server.indexOf("@")==-1 && subs.indexOf("@")!=-1) { server = subs.replace("vmess://", "").split("?")[0]}
  var node = ""
  var ip = "vmess=" + server.split("@")[1] + ", " + "method=aes-128-gcm, " 
  var pwd =  server.split("@")[0].split(":")[1]? "password=" + server.split("@")[0].split(":")[1] + ", " : "password=" + server.split("@")[0]+ ", "
  if (subs.indexOf("#")==-1) {
    tag = /remarks*=/.test(subs)? "tag=" + decodeURIComponent(subs.split(/remarks*=/)[1].split("&")[0]) : "tag="+server.split("@")[1] //trường hợp một phần không có tên node
  } else {
    tag = "tag=" + subs.split("#")[1]
  }
  var tfo = subs.indexOf("tfo=1") != -1 ? "fast-open=true, " : "fast-open=false, "
  var udp = Pudp == 1 ? "udp-relay=false, " : "udp-relay=false, ";
  var pdrop = 0
  node = ip + pwd+ tfo + udp
  var obfs = subs.indexOf("obfs=")!=-1 ? subs.split("obfs=")[1].split("&")[0].trim() : "none"
  if (obfs == "none") { //
    obfs = subs.indexOf("tls=1") != -1 ? "obfs=over-tls, " : "" //over-tls
  } else if (obfs == "websocket" || obfs == "http") {
    obfs = obfs == "http" ? "obfs=http, " : "obfs=ws, " // dạng http
    obfs = subs.indexOf("tls=1") != -1 ? "obfs=wss, " : obfs //dạng ws, wss
    var ouri = subs.indexOf("&path=") != -1 ? decodeURIComponent(subs.split("&path=")[1].split("&")[0]) : "/" //dạng ws, wss
    obfs = obfs + "obfs-uri=" + ouri + ", "
    var host = subs.indexOf("&obfsParam=") != -1 ? decodeURIComponent(subs.split("&obfsParam=")[1].split("&")[0].split("\n")[0]).split("\n")[0].trim() : ""
    if (host.indexOf("\"Host\"")!=-1 && host.indexOf("{")!=-1) {
      host = JSON.parse(host)["Host"]
    }
    host = host!="{}" && host ? "obfs-host=" + host + ", " : ""
    obfs = obfs + host
  // Ghi chú sửa truyền tải VMess của Shadowrocket ⟦2026-08-09 08:42:50 +08⟧
  // Quantumult X không hỗ trợ các truyền tải như mKCP/DTLS; thống nhất thông báo và bỏ qua dạng không hỗ trợ, tránh tạo các trường không hợp lệ như mkcptag.
  } else if (obfs=="grpc" || obfs =="h2") {
    Perror = 1 // dạng không cần phản hồi
    if (Pntf0!=0) {
  }
    pdrop = 1
  } else {
    Perror = 1
    pdrop = 1
  }
  if (obfs.indexOf("obfs=over-tls") != -1 || obfs.indexOf("obfs=wss") != -1) {
    var cert = TLSCertParam(Pcert0, subs.indexOf("allowInsecure=1") != -1 ? "false" : "true") + ", "
    var tls13 = PTls13 == 1 ? "tls13=true, " : ""
    obfs = obfs + cert + tls13
  }
  caead="aead=false, "
  if (subs.indexOf("alterId=") != -1) {
    caead = Number(subs.split("alterId=")[1].split("&")[0]) != 0 ? "aead=false, " : ""
  }
  node = pdrop==0? node + obfs +caead+ tag : ""
  //$notify(node)
  return node
}

//Chuyển đổi URI socks định dạng Shadowrocket
function S5R2QX(cnt,tlsp="false") {
  var listh = Base64.decode(cnt.split("socks://")[1].split("#")[0].split("?")[0])
  server=cnt.indexOf("#")!=-1? listh+"#"+cnt.split("?")[1] : listh+"?"+cnt.split("?")[1]
  var nss = []
  if (server != "") {
      var ipport = "socks5=" + server.split("@")[1].split("#")[0].split("/")[0];
      var uname = "username=" + server.split(":")[0];
      var pwd = "password=" + server.split("@")[0].split(":")[1];
      var tag = "tag=" + decodeURIComponent(server.split("remarks=")[1].split("&")[0]);
      var tls = tlsp=="false"? "":"over-tls=true"
      var cert = TLSCertParam(Pcert0, "false");
      cert = tls == ""? "":cert
      var tfo = Ptfo0 == 1 ? "fast-open=true" : "fast-open=false";
      nss.push(ipport, uname, pwd, tls, cert, tfo, tag)
  }
  var QX = nss.filter(Boolean).join(",");
  return QX
}
 
// Chuyển đổi socks URI 2026-05-25, phần không có đặt tên remarks
function Socks2QX(cnt,tlsp="false") {
  var listh = Base64.decode(cnt.split("socks://")[1].split("#")[0].split("?")[0])
  server=cnt.indexOf("#")!=-1? listh+"#"+cnt.split("?")[1] : listh+"?"+cnt.split("?")[1]
  var nss = []
  if (server != "") {
      var ipport = "socks5=" + server.split("@")[1].split("#")[0].split("/")[0];
      var uname = "username=" + server.split(":")[0];
      var pwd = "password=" + server.split("@")[0].split(":")[1];
      name = server.indexOf("#") != -1? server.split("#")[1] : ipport.split("=")[1].split(":")[0]
      var tag = "tag=" + decodeURIComponent(name.split("&")[0]);
      var tls = tlsp=="false"? "":"over-tls=true"
      var cert = TLSCertParam(Pcert0, "false");
      cert = tls == ""? "":cert
      var tfo = Ptfo0 == 1 ? "fast-open=true" : "fast-open=false";
      nss.push(ipport, uname, pwd, tls, cert, tfo, tag)
  }
  var QX = nss.filter(Boolean).join(",");
  return QX
}

//Chuyển URI V2RayN thành định dạng QUANX
function V2QX(subs, Pudp, Ptfo, Pcert0, PTls13) {
  //console.log("v2 type",subs)
  var cert = Pcert0
  var tls13 = PTls13
  var server = String(Base64.decode(subs.replace("vmess://", "")).trim()).split("\u0000")[0];
  var nss = [];
  if (server != "") {
    ss = JSON.parse(server);
    if(Pdbg) {$notify("Vmess-URI","",JSON.stringify(ss))}
    ip = "vmess=" + ss.add + ":" + ss.port;
    pwd = "password=" + ss.id;
    mtd = "method=aes-128-gcm"
    try {
      tag = "tag=" + decodeURIComponent(ss.ps);
    } catch (e) {
      tag = "tag=" + ss.ps;
    }
    udp = Pudp == 1 ? "udp-relay=false" : "udp-relay=false";
    tfo = Ptfo == 1 ? "fast-open=true" : "fast-open=false";
    obfs = Fobfs(ss, cert, tls13);
    caead = ss.aid && ss.aid != "0" ? "aead=false" : "aead=true"; //tùy chọn aead
    if (obfs == "" || obfs == undefined) {
      nss.push(ip, mtd, pwd, tfo, udp, caead, tag)
    } else if(obfs != "NOT-SUPPORTTED"){
      nss.push(ip, mtd, pwd, obfs, tfo, udp, caead, tag);
    } else if(obfs == "NOT-SUPPORTTED"){
      PNS=PNS+1
      NSList.push(numToEmoji10(PNS)+subs)
    }
    QX = nss.join(", ");
  }
  return QX
}

// Tham số obfs của Vmess
function Fobfs(jsonl, Pcert0, PTls13) {
  var obfsi = [];
  var cert = Pcert0;
  tcert = TLSCertParam(cert, "false");
  tls13 = PTls13 == 1 ? "tls13=true" : "tls13=false"
  if (jsonl.net == "ws" && jsonl.tls == "tls") {
    obfs0 = "obfs=wss, " + tcert + ", " + tls13 + ", ";
    uri0 = jsonl.path && jsonl.path != "" ? "obfs-uri=" + jsonl.path : "obfs-uri=/";
    uri0 = uri0.indexOf("uri=/")!=-1 ? uri0:uri0.replace("uri=","uri=/")
    host0 = jsonl.host && jsonl.host != "" ? "obfs-host=" + jsonl.host + ", " : "";
    obfsi.push(obfs0 + host0 + uri0)
    return obfsi.join(", ")
  } else if (jsonl.net == "ws") {
    obfs0 = "obfs=ws";
    uri0 = jsonl.path && jsonl.path != "" ? "obfs-uri=" + jsonl.path : "obfs-uri=/";
    uri0 = uri0.indexOf("uri=/")!=-1 ? uri0:uri0.replace("uri=","uri=/")
    host0 = jsonl.host && jsonl.host != "" ? "obfs-host=" + jsonl.host + ", " : "";
    obfsi.push(obfs0, host0 + uri0);
    return obfsi.join(", ")
  } else if (jsonl.tls == "tls" && (jsonl.net == "tcp" || jsonl.net == "none")) { // lọc bỏ các dạng h2/http... 
    obfs0 = "obfs=over-tls, " + tcert + ", " + tls13;
    uri0 = jsonl.path && jsonl.path != "" ? "obfs-uri=" + jsonl.path : "";
    uri0 = uri0.indexOf("uri=/")!=-1 ? uri0:uri0.replace("uri=","uri=/")
    host0 = jsonl.host && jsonl.host != "" ? ", obfs-host=" + jsonl.host : "";
    obfsi.push(obfs0 + host0)
    return obfsi.join(", ")
  } else if ((jsonl.net == "tcp" || jsonl.net == "none") && jsonl.type == "http"){
    obfs0 = "obfs=http";
    uri0 = jsonl.path && jsonl.path != "" ? "obfs-uri=" + jsonl.path : "obfs-uri=/";
    uri0 = uri0.indexOf("uri=/")!=-1 ? uri0:uri0.replace("uri=","uri=/")
    host0 = jsonl.host && jsonl.host != "" ? "obfs-host=" + jsonl.host + ", " : "";
    obfsi.push(obfs0, host0 + uri0);
    return obfsi.join(", ")
  } else if (jsonl.net !="tcp" && jsonl.net !="none" &&  jsonl.net != undefined){ // lọc bỏ các dạng h2/http...
    Perror = 1
    return "NOT-SUPPORTTED"
  } else if ((jsonl.net == "tcp" || jsonl.net == "none") && jsonl.type != undefined && jsonl.type != "none" && jsonl.type != "" && jsonl.type != "vmess") {
    return "NOT-SUPPORTTED"
  } else {return ""}
}

//Xử lý đặc biệt cho dấu . (trong in/out & rename)
function Dot2(cnt) {
    cnt = cnt ? cnt.replace(/\\\./g, "这是个点") : ""
    return cnt
}

function ToDot(cnt) {
    cnt = cnt ? cnt.replace(/这是个点/g, ".") : ""
    return cnt
}

//Lọc bằng regex, khớp toàn bộ nội dung
function Regex(content) {
    var Preg0 = RegExp(Preg, "i")
    cnt = flag == 2 || flag == 3 ? RuleNoteBody(content) : content
    if (Preg0.test(cnt)) {
        return content
    }
}

//Xóa bằng regex, khớp toàn bộ nội dung
function RegexOut(content) {
  var Preg0 = RegExp(Pregout, "i")
  cnt = flag == 2 || flag == 3 ? RuleNoteBody(content) : content
  if (!Preg0.test(cnt)) {
    return content
  } else {
    RegoutList.push(cnt)
  }
}

// Hàm kiểm tra lọc node
function Scheck(content, param) {
    name = content.replace(/tag\s*\=/g,"tag=").split("tag=")[1].toUpperCase()
    param = param ? param.map(Dot2) : param // xử lý đặc biệt cho ký tự .
    if (param) {
        var flag = 0;
        for (var i = 0; i < param.length; i++) {
            var params = param[i].split(".").map(ToDot);
            const checkpara = (item) => name.indexOf(item.toUpperCase()) != -1;
            if (params.every(checkpara)) {
                flag = 1
            }
        }//for
        return flag
    } else { //if param
        return 2
    }
}

//Lọc node, dùng + để nối nhiều từ khóa (logic "hoặc"): in là giữ lại, out là loại bỏ, logic "và" dùng ký tự "." để nối
function Filter(servers, Pin, Pout) {
    var Nlist = [];
    var Delist = [];
    var Nname = [];
    servers = servers.filter(Boolean)
    for (var i = 0; i < servers.length; i++) {
        if (Scheck(servers[i], Pin) != 0 && Scheck(servers[i], Pout) != 1) {
            Nlist.push(servers[i])
            Nname.push(servers[i].replace(/ /g, "").split("tag=")[1])
        } else { Delist.push(servers[i].replace(/ /g, "").split("tag=")[1]) } //ghi lại node không được giữ lại
    }//for
    var no = Delist.length <= 10 ? emojino[Delist.length] : Delist.length;
    var no1 = Nlist.length <= 10 ? emojino[Nlist.length] : Nlist.length;
    if (Pntf0 == 1 && Delist.length >= 1) {//phần thông báo
        if (Pin && no1 > 0) { //có tham số in thì thông báo phần giữ lại
            $notify("👥 Tham chiếu" + "⟦" + subtag + "⟧" + " bắt đầu lọc node", "🕹 Từ khóa lọc: " + pfi + pfo, "☠️ Đã giữ lại " + no1 + " node sau\n" + Nname.join(", "), sub_link);
        } else if (Pout && no > 0) {
            $notify("👥 Tham chiếu" + "⟦" + subtag + "⟧" + " bắt đầu lọc node", "🕹 Từ khóa lọc: " + pfi + pfo, "☠️ Đã xóa " + no + " node sau\n" + Delist.join(", "), sub_link);
        }
    } else if (no1 == 0 || no1 == null) { //khi không còn node thì bắt buộc thông báo
        $notify("‼️ ⟦" + subtag + "⟧" + "Sau khi lọc số node là 0️⃣", "⚠️ Vui lòng tự kiểm tra link gốc và tham số lọc", link0, sub_link);
    }
    return Nlist
}

function FilterScript(servers, script) {
    $notify("🤖 Bật script để lọc", "", script);
    try {
        const $ = Tools();
        eval(script);
        // extract server tags
        const nodes = Tools().getNodeInfo(servers);
        const IN = filter(nodes);
        const res = servers.filter((_, i) => IN[i]);
        if (res.length === 0) {
            $notify("‼️ ⟦" + subtag + "⟧" + "Sau khi lọc số node là 0️⃣", "⚠️ Vui lòng tự kiểm tra link gốc và tham số lọc", link0, sub_link);
        }
        return res;
    } catch (err) {
        $notify("❌ Lọc bằng script xảy ra lỗi", "", err);
        return servers;
    }
}

//a.c.com:0031:origin:aes-256-gcm:plain:pwdpwd/?obfsparam=&remarks=xxxx
//Chuyển đổi URI dạng SSR thành định dạng QuanX
function SSR2QX(subs, Pudp, Ptfo) {
    var nssr = []
    var cnt = Base64.decode(subs.split("ssr://")[1].replace(/-/g, "+").replace(/_/g, "/")).split("\u0000")[0]
    var obfshost = '';
    var oparam = '';
    if(Pdbg==1) {$notify("ssr","content",cnt)}
    if (cnt.split(":").length <= 8) { //loại bỏ node IPv6 khó xử lý
        type = "shadowsocks=";
        ip = cnt.split(":")[0] + ":" + cnt.split(":")[1];
        pwd = "password=" + Base64.decode(cnt.split("/?")[0].split(":")[5].replace(/-/g, "+").replace(/_/g, "/")).split("\u0000")[0];
        mtd = "method=" + cnt.split(":")[3];
        obfs =cnt.split(":")[4]!= "plain"? "obfs=" + cnt.split(":")[4] : ""; //plain?
        ssrp = cnt.split(":")[2] != "origin"? "ssr-protocol=" + cnt.split(":")[2] : ""; //origin?
        if (cnt.indexOf("obfsparam=") != -1 && obfs != "") {
            obfshost = cnt.split("obfsparam=")[1].split("&")[0] != "" ? "obfs-host=" + Base64.decode(cnt.split("obfsparam=")[1].split("&")[0].replace(/-/g, "+").replace(/_/g, "/")).split(",")[0].split("\u0000")[0] : ""
        }
        if (cnt.indexOf("protoparam=") != -1) {
            oparam = cnt.split("protoparam=")[1].split("&")[0] != "" ? "ssr-protocol-param=" + Base64.decode(cnt.split("protoparam=")[1].split("&")[0].replace(/-/g, "+").replace(/_/g, "/")).split(",")[0].split("\u0000")[0]  : ""
        }
        tag = "tag=" + (Base64.decode(cnt.split("remarks=")[1].split("&")[0].replace(/-/g, "+").replace(/_/g, "/"))).split("\u0000")[0]
        pudp = Pudp == 1 ? "udp-relay=true" : "udp-relay=false";
        ptfo = Ptfo == 1 ? "fast-open=true" : "fast-open=false";
        nssr.push(type + ip, pwd, mtd, obfs , obfshost, oparam, ssrp, pudp, ptfo, tag)
        QX = nssr.filter(Boolean).join(", ")
    } else { QX = "" }
    return QX;
}

// Chuyển URI AnyTLS thành định dạng QuanX
//anytls://pwd@name:443?peer=xxx.com&udp=1#US-A-ANYTLS-0.5%E5%80%8D%E7%8E%8
// tls with reality
//anytls://ip:port?security=reality&pbk=yourkey&sid=yourshortip&fp=chrome&sni=sample.com#Server-Anytls_Reality

function Anytls2QX(subs,Pcert0) {
  try {
    var Nanytls=[];
    var cnt=subs.split("anytls://")[1]
    type="anytls=";
    ip = cnt.split("@")[1].split("encry")[0].split("?")[0];
    pwd = cnt.split("@")[0]? "password=" + cnt.split("@")[0]:"";
    ptls="over-tls=true"
    pcert = TLSCertParam(Pcert0, cnt.indexOf("allowInsecure=0") != -1 ? "true" : "false");
    thost = cnt.indexOf("sni=") != -1? "tls-host="+cnt.split("sni=")[1].split(/&|#/)[0]:""
    thost = cnt.indexOf("peer=") != -1? "tls-host="+cnt.split("peer=")[1].split(/&|#/)[0]:thost
    pudp = Pudp0 == -1 ? "udp-relay=false" : "udp-relay=true" // mặc định bật
    tag = cnt.indexOf("#") != -1 ? "tag=" + decodeURIComponent(cnt.split("#").slice(-1)[0]) : "tag= [anytls]" + ip
    // reality
    prlt= version>=914? Reality_Handle(cnt) : ""
    Nanytls.push(type + ip, pwd, ptls, pcert, pudp, thost, prlt, tag)
    QX= Nanytls.filter(Boolean).join(", ")
    return QX
  } catch (error) {
    console.log(error)
  }
}

// Chuyển URI Vless thành định dạng QUANX
// vless://pwd@a.b.c.gq:443?encryption=none&security=tls&type=ws&host=a.b.c.d&path=dsjdaaaaj#VLESS_WSS
// Vless Shadowrocket URI
// vless://YXV0bzpkampkakAxLjEuMS4xOjY2NjY?remarks=vless&obfsParam=123.com&path=/jsjdj&obfs=websocket&tls=1&peer=abc.com&tfo=1
//;vless=example.com:443, method=none, password=23ad6b10-8d1a-40f7-8ad0-e3e35cd32291, obfs=wss, obfs-uri=/ws, fast-open=false, udp-relay=false, tag=vless-ws-tls-01
//vless://YXV0bzpkampkakAxLjEuMS4xOjY2NjY?remarks=vless&obfsParam=hshdh&path=/jsjdj&obfs=http&tls=1&peer=abc.com&tfo=1
//vls = VLESS,1.1.1.1,443,"b0dd64e4-0fbd-4038-9139-d1f32a68a0dc",transport=ws,path=patha,host=host.com,udp=true,over-tls=true,tls-name=sni.co
function VL2QX(subs, Pudp, Ptfo, Pcert0, PTls13) {
  var nvless = []
  var cnt = subs.split("vless://")[1]
  type = "vless=";
  mtd= "method=none"
  obfs=""
  thost=""
  if((cnt.indexOf("remarks=")==-1 && cnt.indexOf("remark=")==-1) && cnt.indexOf("@")!=-1) { // normal URI
  typeU = "URI"
  ip = cnt.split("@")[1].split("encry")[0].split("?")[0];
  pwd = cnt.split("@")[0]? "password=" + cnt.split("@")[0]:"";
  pcert = TLSCertParam(Pcert0, cnt.indexOf("allowInsecure=0") != -1 ? "true" : "false");
  thost = cnt.indexOf("sni=") != -1? "tls-host="+cnt.split("sni=")[1].split(/&|#/)[0]:""
  thost = cnt.indexOf("peer=") != -1? "tls-host="+cnt.split("peer=")[1].split(/&|#/)[0]:thost
  tag = cnt.indexOf("#") != -1 ? "tag=" + decodeURIComponent(cnt.split("#").slice(-1)[0]) : "tag= [vless]" + ip
  } else { // shadowrocket style
    typeU = "SR-URI"
    b64part = Base64.decode(cnt.split("?")[0])
    ip = b64part.split("@")[1]
    pwd = "password=" + b64part.split("@")[0].split(":")[1]
    tag = cnt.indexOf("remarks=") != -1 ? "tag=" + decodeURIComponent(cnt.split("remarks=")[1].split("&")[0]) : "tag= [vless]" + ip
    tag = cnt.indexOf("remark=") != -1 ? "tag=" + decodeURIComponent(cnt.split("remark=")[1].split("&")[0]) : tag
  }
 
  puri = ""
 
  pudp = (Pudp == 1 || cnt.indexOf("udp=1")!=-1) ? "udp-relay=true" : "udp-relay=false";
  ptfo = (Ptfo == 1 || cnt.indexOf("tfo=1")!=-1)? "fast-open=true" : "fast-open=false";
  //ptfo = cnt.indexOf("tfo=1") != -1? "fast-open=true" : ptfo
  if (typeU == "SR-URI") {//cách viết websocket trong Shadowrocket
    if((cnt.indexOf("obfs=none")!=-1 || cnt.indexOf("obfs=")==-1) && cnt.indexOf("tls=1")==-1) {
      // tcp
      obfs = ""
    } else if((cnt.indexOf("obfs=none")!=-1 || cnt.indexOf("obfs=")==-1) && cnt.indexOf("tls=1")!=-1) {
      obfs = "obfs=over-tls"
    } else if(cnt.indexOf("obfs=http")!=-1) {
      obfs = "obfs=http"
    } else if(cnt.indexOf("obfs=websocket")!=-1) {
      obfs = cnt.indexOf("tls=1") != -1? "obfs=wss" : "obfs=ws"
    } else { //dạng không hỗ trợ
      type="NS"
    }
  thost=cnt.indexOf("obfsParam=") == -1? thost : "obfs-host=" + decodeURIComponent(cnt.split("obfsParam=")[1].split("&")[0].split("#")[0]).replace(/\"|(Host\":)|\{|\}/g,"")
  thost=cnt.indexOf("sni=") == -1? thost : "obfs-host=" + decodeURIComponent(cnt.split("sni=")[1].split("&")[0].split("#")[0]).replace(/\"|(Host\":)|\{|\}/g,"")
  thost=cnt.indexOf("peer=") == -1? thost : "obfs-host=" + decodeURIComponent(cnt.split("peer=")[1].split("&")[0].split("#")[0]).replace(/\"|(Host\":)|\{|\}/g,"")

  puri = cnt.indexOf("path=") == -1? puri : "obfs-uri=" + decodeURIComponent(cnt.split("path=")[1].split("&")[0].split("#")[0])
  } else if (cnt.indexOf("&type=ws")!=-1 || cnt.indexOf("?type=ws")!=-1 || cnt.indexOf("type=http")!=-1 || cnt.indexOf("security=tls")!=-1 || cnt.indexOf("security=reality")!=-1) {//v2rayN uri
    if(cnt.indexOf("type=http") != -1) {
      obfs="obfs=http"
    } else if (cnt.indexOf("type=ws") != -1) {
      obfs = cnt.indexOf("security=tls") != -1 || cnt.indexOf("security=reality")!=-1? "obfs=wss" : "obfs=ws" 
    } else if(cnt.indexOf("type=")==-1 || cnt.indexOf("type=tcp")!=-1) {
      obfs = "obfs=over-tls"
    } else if(cnt.indexOf("type=")!=-1 && cnt.indexOf("type=tcp")==-1) {//dạng tạm thời chưa hỗ trợ
    type="NS"
  }
    thost1=cnt.indexOf("&host=") == -1? thost : "obfs-host=" + decodeURIComponent(cnt.split("&host=")[1].split("&")[0].split("#")[0])
    thost2=cnt.indexOf("sni=") == -1? thost : "obfs-host=" + decodeURIComponent(cnt.split("sni=")[1].split("&")[0].split("#")[0]).replace(/\"|(Host\":)|\{|\}/g,"")
    thost = thost1.length >= thost2.length ? thost1 : thost2;
    puri = cnt.indexOf("&path=") == -1? puri : "obfs-uri=" + decodeURIComponent(cnt.split("&path=")[1].split("&")[0].split("#")[0])
  } 
if(obfs=="obfs=wss" || obfs=="obfs=over-tls"){
  ptls13 = PTls13 == 1 ? "tls13=true" : "tls13=false"
  pcert = TLSCertParam(Pcert0, cnt.indexOf("allowInsecure=0") != -1 ? "true" : "false");
} else {
  pcert=""
  ptls13=""
}
// Reality para 2025-12-30
  prlt= version>=891? Reality_Handle(cnt) : ""
  nvless.push(type + ip, pwd, mtd, obfs, pcert, thost, puri, pudp, ptfo, prlt, tag)
  QX = type!="NS"? nvless.filter(Boolean).join(", ")  : ""
  if (type=="NS") {
    PNS=PNS+1
    NSList.push(numToEmoji10(PNS)+subs)
  }
  return QX
}

//Chuyển URI dạng Trojan thành QX, bao gồm dạng Shadowrocket
function TJ2QX(subs, Pudp, Ptfo, Pcert0, PTls13) {
    var ntrojan = []
    var cnt = subs.split("trojan://")[1]
    type = "trojan=";
    if (cnt.indexOf(":443") != -1) {
        ip = cnt.split("@")[1].split(":443")[0] + ":443";
    } else {
        ip = cnt.split("@")[1].split("?")[0].split("\n")[0].split("#")[0].trim(); //provider kỳ lạ không dùng cổng 443?
    }
    pwd = cnt.split("@")[0]? "password=" + decodeURIComponent(cnt.split("@")[0]):"";
    obfs = "over-tls=true";
    pcert = TLSCertParam(Pcert0, cnt.indexOf("allowInsecure=0") != -1 ? "true" : "false");
    thost = cnt.indexOf("sni=") != -1? "tls-host="+cnt.split("sni=")[1].split(/&|#/)[0]:""
    thost = cnt.indexOf("peer=") != -1? "tls-host="+cnt.split("peer=")[1].split(/&|#/)[0]:thost
    ptls13 = PTls13 == 1 ? "tls13=true" : "tls13=false"
    puri = ""
    pcert = TLSCertParam(Pcert0, cnt.indexOf("allowInsecure=0") != -1 ? "true" : "false");
    pudp = (Pudp == 1 || cnt.indexOf("udp=1")!=-1) ? "udp-relay=true" : "udp-relay=false";
    ptfo = (Ptfo == 1 || cnt.indexOf("tfo=1")!=-1)? "fast-open=true" : "fast-open=false";
    //ptfo = cnt.indexOf("tfo=1") != -1? "fast-open=true" : ptfo
    tag = cnt.indexOf("#") != -1 ? "tag=" + decodeURIComponent(cnt.split("#").slice(-1)[0]) : "tag= [trojan]" + ip
    if (cnt.indexOf("&plugin=obfs-local")!=-1) {//cách viết websocket trong Shadowrocket
    obfs = cnt.indexOf("obfs=websocket") != -1? "obfs=wss" : obfs 
    thost=cnt.indexOf("obfs-host=") == -1? thost : "obfs-host=" + decodeURIComponent(cnt.split("obfs-host=")[1].split(";")[0].split("#")[0])
    puri = cnt.indexOf("obfs-uri=") == -1? puri : "obfs-uri=" + decodeURIComponent(cnt.split("obfs-uri=")[1].split(";")[0].split("#")[0])
    } else if (cnt.indexOf("&type=ws")!=-1 || cnt.indexOf("?type=ws")!=-1) {//v2rayN uri
      obfs = cnt.indexOf("security=tls") != -1? "obfs=wss" : obfs 
      thost=cnt.indexOf("&host=") == -1? thost : "obfs-host=" + decodeURIComponent(cnt.split("&host=")[1].split("&")[0].split("#")[0])
      puri = cnt.indexOf("&path=") == -1? puri : "obfs-uri=" + decodeURIComponent(cnt.split("&path=")[1].split("&")[0].split("#")[0])
    }
    // Reality para 2025-12-31
    prlt= version>=891? Reality_Handle(cnt) : ""
    ntrojan.push(type + ip, pwd, obfs, pcert, thost, puri, pudp, ptfo,prlt,tag)
    QX = ntrojan.filter(Boolean).join(", ");
    //$notify("title","subtitle",QX)
    return QX;
}

function joinx(total,item) {
  return total+":"+item
}

//Chuyển đổi URI dạng SS thành định dạng QuanX
function SS2QX(subs, Pudp, Ptfo) {
  var nssr = []
  var cnt = subs.split("ss://")[1]
  QX=""
  if (cnt.split(":").length <= 10) { //loại bỏ node IPv6 khó xử lý
    type = "shadowsocks=";
    let cntt = cnt.split("#")[0]// 
    //console.log(cntt)
    if (cntt.indexOf("@") != -1 && cntt.indexOf(":") != -1) { 
      ip = cnt.split("@")[1].split("#")[0].split("/")[0].split("?")[0];
      if(cntt.indexOf("%")==-1 || cntt.split("@")[0].indexOf(":")==-1){ // 2026-05-18 :(%3D)|(\=)
        pwdmtd = Base64.decode(cnt.split("@")[0].replace(/-/g, "+").replace(/_/g, "/").replace(/(%3D)|(\=)/g,"")).split("\u0000")[0].split(":")
      } else {
        pwdmtd = decodeURIComponent(cnt.split("@")[0]).split(":")
      }
    } else if (cntt.indexOf("?")==-1) { // dạng b64 encode ở phần sau
      var cnt0 = Base64.decode(cnt.split("#")[0].replace(/-/g, "+").replace(/_/g, "/").split("\u0000")[0]);
      ip = cnt0.split("@")[1].split("#")[0].split("/")[0];
      pwdmtd = cnt0.split("@")[0].split(":")
    } else if (cntt.indexOf("?") !=-1) { // dạng Shadowrocket?
      var cnt0 = Base64.decode(cnt.split("#")[0].split("?")[0].replace(/-/g, "+").replace(/_/g, "/").split("\u0000")[0]);
      var cnt1 = Base64.decode(cnt.split("#")[0].split("?")[1].split("=")[1].replace(/-/g, "+").replace(/_/g, "/").split("\u0000")[0]);
      ip = cnt0.split("@")[1].split("#")[0].split("/")[0];
      pwdmtd = cnt0.split("@")[0].split(":")
    } 
    if(Pdbg) {$notify("dd","",pwdmtd)}
    mtd = "method=" + pwdmtd[0];
    pwdmtd.splice(0,1) 
    pwd = "password=" + pwdmtd.reduce(joinx);
    if (cntt.indexOf("v2ray-plugin")==-1 && cntt.indexOf("plugin=v2ray")==-1) { //Shadowrocket style v2-plugin
      obfs = cnt.split("obfs%3D")[1] != null ? ", obfs=" + cnt.split("obfs%3D")[1].split("%3B")[0].split("#")[0] : "";
      obfshost = cnt.split("obfs-host%3D")[1] != null ? ", obfs-host=" + decodeURIComponent(cnt.split("obfs-host%3D")[1].split("&")[0].split("#")[0]) : "";
    } else if (cnt1 != undefined){
      cnt1 = JSON.parse(cnt1)
      obfs= cnt1.tls? ", obfs=wss" : ", obfs=ws"
      obfshost = cnt1.host? ", obfs-host="+cnt1.host+", "+TLSCertParam(Pcert0, "false") : ""
    } else if (cntt.indexOf("v2ray-plugin")!=-1){
      cnt1 = decodeURIComponent(cntt.split("v2ray-plugin")[1])
      obfs= cnt1.indexOf("tls")!=-1? ", obfs=wss" : ", obfs=ws"
      obfshost = cnt1.indexOf("host=")!=-1? ", obfs-host="+cnt1.split("host=")[1].split(";")[0].split("#")[0].trim() : ""
      obfshost = obfshost != "obfs-host="? obfshost : ""
      //$notify("CNTT","",cnt1+obfs+obfshost)
    } else if (cntt.indexOf("plugin=v2ray")!=-1) {
      cnt1 = decodeURIComponent(cntt.split("plugin=v2ray")[1])
      obfs= cnt1.indexOf("tls")!=-1? ", obfs=wss" : ", obfs=ws"
      obfshost = cnt1.indexOf("host=")!=-1? ", obfs-host="+cnt1.split("host=")[1].split(";")[0].split("#")[0].trim() : ""
      obfshost = obfshost != "obfs-host="? obfshost : ""
      //$notify("CNTT","",cnt1+obfs+obfshost)

    }
    tag = decodeURIComponent(cnt.split("#")[1])!="undefined"? "tag=" + decodeURIComponent(cnt.split("#")[1]) : "tag=" + ip
    pudp = Pudp == 1 ? "udp-relay=true" : "udp-relay=false";
    ptfo = Ptfo == 1 ? "fast-open=true" : "fast-open=false";
    nssr.push(type + ip, pwd, mtd + obfs + obfshost, pudp, ptfo, tag)
    QX = nssr.join(", ")
    if(Pdbg==1) {$notify("SS","content",cnt+"\n"+QX)}
  }
  return QX;
}


//Chuyển đổi URI dạng SSD thành định dạng QuanX
function SSD2QX(subs, Pudp, Ptfo) {
    var j = 0
    var QX = []
    var cnt = JSON.parse(Base64.decode(subs.split("ssd://")[1]))
    var type = "shadowsocks=";
    var pwd = "password=" + cnt.password;
    var mtd = "method=" + cnt.encryption;
    var obfs = ""
    var obfshost = ""
    var port = cnt.port ? ":" + cnt.port : ""
    if (cnt.plugin_options) {
        obfs = cnt.plugin_options.split(";")[0] != null ? ", " + cnt.plugin_options.split(";")[0] : "";
        obfshost = cnt.plugin_options.split(";")[1] != null ? ", " + cnt.plugin_options.split(";")[1] : "";
    }
    pudp = Pudp == 1 ? "udp-relay=true" : "udp-relay=false";
    ptfo = Ptfo == 1 ? "fast-open=true" : "fast-open=false";
    for (var i in cnt.servers) {
        ip = cnt.servers[i].server;
        if (cnt.servers[i].plugin_options) {
            obfs = cnt.servers[i].plugin_options.split(";")[0] != null ? ", " + cnt.servers[i].plugin_options.split(";")[0] : "";
            obfshost = cnt.servers[i].plugin_options.split(";")[1] != null ? ", " + cnt.servers[i].plugin_options.split(";")[1] : "";
        }
        if (cnt.servers[i].encryption) {  //Phương thức mã hóa riêng
            mtd = "method=" + cnt.servers[i].encryption
        }
        if (cnt.servers[i].password) {  //Mật khẩu riêng
            pwd = "password=" + cnt.servers[i].password
        }
        if (ip.indexOf(".") > 0) { //Loại bỏ node ipv6 khó xử lý
            port = cnt.servers[i].port ? ":" + cnt.servers[i].port : port;
            tag = "tag=" + cnt.servers[i].remarks;
            QX[j] = type + ip + port + ", " + pwd + ", " + mtd + obfs + obfshost + ", " + pudp + ", " + ptfo + ", " + tag;
            var j = j + 1;
        }
    }
    return QX;
}

/*
Giải thích sửa lỗi QXFix ⟦2026-07-11 09:51:48 +08⟧
----------------------------------------------------------
Chỉ thay đổi resource-parser-r.js.
Sửa lỗi dấu phẩy trong obfs-uri bị cnti.split(",") tách nhầm rồi ghép vào tag.
QuanX không hỗ trợ dấu phẩy trong path/uri, vì vậy trước khi tách trường bên trong QXFix, danh sách dấu phẩy trong giá trị obfs-uri được nén thành mục đầu tiên và giữ lại query cuối cùng.
----------------------------------------------------------
*/
// Sửa một số cách viết không chuẩn (không đặt tag ở cuối)
function QXFix(cntf) {
var cnti = cntf.replace(/\s*tag\s*\=/g,"tag=").replace("chacha20-poly","chacha20-ietf-poly")
try {
  function normalizeQXObfsUriValue(str) {
    var fieldK = "(password|method|udp-relay|udp-over-tcp|fast-open|obfs|obfs-host|obfs-uri|over-tls|tls-host|tls-verification|tls13|aead|tag|username|tls-alpn|server_check_url|tls-cert-sha256|tls-pubkey-sha256|reality-base64-pubkey|reality-hex-shortid|vless-flow)";
    return str.replace(new RegExp("(obfs-uri=)([\\s\\S]*?)(,\\s*" + fieldK + "=|$)", "g"), function(match, key, value, tail) {
      if (value.indexOf(",") == -1) {
        return key + value + tail;
      }
      var first = value.split(",")[0];
      var queryIndex = value.lastIndexOf("?");
      var query = queryIndex == -1 ? "" : value.slice(queryIndex);
      if (first.indexOf("?") != -1) {
        first = first.split("?")[0];
      }
      return key + first + query + tail;
    });
  }
  var hd = cnti.split(",tag=")[0]
  var tag = "tag="+cnti.split(",tag=")[1].split(",")[0].trim()
  var tail = cnti.split(tag+",")
  cnti = tail.length<=1?  cnti : String(hd + ","+tail[1].split("\r")[0] +"," + tag)
  cnti = normalizeQXObfsUriValue(cnti)
  cntis = cnti.split(",").filter(Boolean).map(item => item.trim()) //Tránh trường hợp lỗi do tên node chứa dấu ,
  tagfix = ""
  cntii = ""
  for (i in cntis) {
    if (cntis[i].indexOf("=") == -1 && cntis[i].trim() !="") {  // Mục thừa trong tag
      tagfix += ","+cntis[i]
    } else {
      cntis[i].indexOf("tag=") != 0? cntii += cntis[i]+", ": cntii=cntii
    }
  }
  cntii = cntii+tag+tagfix
  //$notify("tag-fix","Look","cntf:\n"+cntf+"\nhd:\n"+hd+"\ntag:\n"+tag+"\ntail:\n"+tail+"\ncnti: \n"+cnti +"\n\ncntii: \n"+cntii)
  return cntii
} catch (err) {
  if(Perror == 0) {
  $notify("❌ Lỗi phân tích, đã bỏ qua mục này", "⚠️ Hãy nhấn vào thông báo, gửi link subscription để phản hồi", cntf+"\n"+ err, bug_link);
}
}
  return ""
}

// Dùng để lọc phần không phải node (ví dụ nội dung khác trong toàn bộ cấu hình), đồng thời sửa một số cách viết không chuẩn (không đặt tag ở cuối)
function isQuanX(content) {
    var cnts = content.split("\n");
    var nlist = []
    for (var i = 0; i < cnts.length; i++) {
        var cnti = cnts[i];
        if (cnti.indexOf("=") != -1 && cnti.indexOf("tag") != -1) {
            var cnt = cnti.split("=")[0].trim()
            if (cnt == "http" || cnt == "shadowsocks" || cnt == "trojan" || cnt == "vmess" || cnt == "socks5" || cnt == "vless" ||  cnt == "anytls") {
                nlist.push(QXFix(cnti))
            }
        }
    }
   return nlist
}

/*
Giải thích sửa lỗi Rewrite pattern quote ⟦2026-07-06 18:29:51 +08⟧
----------------------------------------------------------
Chỉ thay đổi resource-parser-r.js.
Sửa lỗi sau khi chuyển rewrite Loon/Surge sang QuanX, regex khớp http/https ở đầu rule vẫn giữ dấu ngoặc kép ngoài cùng:
  - Ví dụ `"^https://example.com/ad" reject` trước đây sẽ xuất ra `"https://example.com/ad" url reject`
  - Điểm sửa đặt trước khi ghi cuối cùng trong isQuanXRewrite(), bao phủ các nhánh chuyển đổi và rewrite QuanX gốc truyền thẳng
  - Chỉ gỡ cặp dấu ngoặc kép của đoạn pattern đầu tiên, không xóa ngoặc kép toàn cục, để tránh ảnh hưởng nội dung echo/header/script
----------------------------------------------------------
*/
function RewritePatternQuoteFix(cnti) {
  if (!cnti) { return cnti }
  function stripQuote(pattern) {
    if (pattern.length > 1 && pattern[0] == "\"" && pattern[pattern.length - 1] == "\"") {
      var unquoted = pattern.slice(1, -1).trim();
      if (/^\^?https?\??/i.test(unquoted)) {
        return unquoted;
      }
    }
    return pattern;
  }
  var marker = cnti.indexOf(" url-and-header ") != -1 ? " url-and-header " : " url ";
  var idx = cnti.indexOf(marker);
  if (idx == -1) { return cnti }
  var pattern = cnti.slice(0, idx).trim();
  var rest = cnti.slice(idx);
  if (marker == " url-and-header ") {
    var matched = pattern.match(/^(\"[^\"]+\")(\s+[\s\S]+)$/);
    if (matched) {
      return stripQuote(matched[1]) + matched[2] + rest;
    }
  }
  return stripQuote(pattern) + rest;
}

//surge script/quanx-rewrite - > quanx
// ⟦2026-09-16 12:06 +08⟧ Thất bại chỉ thông báo một lần: nhóm theo lý do, tối đa 5 nhóm/10 ví dụ; mục dài chỉ cắt ngắn để hiển thị.
function NotifyUnsupportedRules(ignored) {
  if (!ignored.length) { return }
  var groups = [], byReason = Object.create(null), shown = 0, truncated = false
  function preview(text, limit) {
    if (text.length <= limit) { return text }
    truncated = true
    var end = limit - 1
    if (/[\uD800-\uDBFF]/.test(text[end - 1])) { end-- }
    return text.slice(0, end) + "…"
  }
  ignored.forEach(function (item) {
    var group = byReason[item.reason]
    if (!group) { group = { reason: item.reason, count: 0, rules: [], selected: [] }; byReason[item.reason] = group; groups.push(group) }
    group.count++
    if (group.rules.length < 10) { group.rules.push(item.rule) }
  })
  var visible = groups.slice(0, 5)
  // Lấy mẫu luân phiên, tránh nhóm đầu tiên chiếm hết suất; trong mỗi nhóm giữ nguyên thứ tự rule nguồn.
  for (var round = 0; round < 10 && shown < 10; round++) {
    for (var i = 0; i < visible.length && shown < 10; i++) {
      if (round < visible[i].rules.length) { visible[i].selected.push(visible[i].rules[round]); shown++ }
    }
  }
  var message = visible.map(function (group) {
    return "Lý do: " + preview(group.reason, 200) + "(tổng " + group.count + " mục)\n" + group.selected.map(function (rule, i) { return (i + 1) + ". " + preview(rule, 240) }).join("\n")
  }).join("\n\n")
  if (shown < ignored.length) { message += "\n\nCòn " + (ignored.length - shown) + " mục chưa mở rộng" + (groups.length > visible.length ? ", còn " + (groups.length - visible.length) + " nhóm lý do chưa hiển thị" : "") + "." }
  $notify("⚠️ Đã bỏ qua " + ignored.length + " rule không thể tự động chuyển đổi ➟ ⟦" + subtag + "⟧", "📋 Nhấn vào thông báo để xem chi tiết (hiển thị " + shown + "/" + ignored.length + " mục)" + (truncated ? ", nội dung dài đã bị cắt ngắn" : ""), message)
}

function isQuanXRewrite(content, failures) {
  var cnt = content.filter(Boolean)
  var cnt0=[]
  var ignoredEcho = failures || []
  var section = "", inComment = false, sectionInComment = false
  for (var i = 0; i< cnt.length; i++){
    if(cnt[i]){
      var cnti = cnt[i].trim()
      var originalRewrite = cnti
      var noteParts = RuleNoteSplit(cnti)
      cnti = noteParts.body
      if (!noteParts.note && /^\{#/.test(cnti)) { continue } // Phần giải thích chưa đóng không được truyền thẳng làm nội dung rewrite.
      if (!cnti || /^(?:#|;|\/\/)/.test(cnti)) { continue }
      // ⟦2026-09-16 16:36 +08⟧ Đoạn cấu hình trong comment chỉ có hiệu lực trong comment đó, không kéo dài sang nội dung script.
      if (/^\/\*/.test(cnti)) { inComment = inComment || cnti.indexOf("*/", 2) == -1; continue }
      if (/^\*+\/(?:\s|$)/.test(cnti)) {
        if (sectionInComment) { section = "" }
        inComment = false; sectionInComment = false; continue
      }
      if (/^\[[^\]]+\]$/.test(cnti)) { section = cnti.toLowerCase(); sectionInComment = inComment; continue }
      // Ngoài đoạn phân luồng chỉ nhận diện dòng có loại đã biết và còn nội dung sau dấu phẩy, không còn coi các trường JS như url, là phân luồng.
      var filterRule = /^[a-z][\w-]*\s*,/i.test(cnti) && (
        section == "[rule]" || section == "[filter_local]" ||
        /^(?:(?:host|domain)(?:-[\w-]+)?|ip-cidr6?|ip6-cidr|ip-asn|geoip|user-agent)\s*,\s*\S/i.test(cnti) ||
        /^(?:AND|OR|NOT)\s*,\s*\(/i.test(cnti)
      )
      var failureCount = ignoredEcho.length
      // Giải thích sửa lỗi echo-response ⟦2026-09-16 09:15:50 +08⟧
      // ⟦2026-09-16 10:32 +08⟧ Chặn tham chiếu script hỗ trợ cục bộ do phiên bản trước tạo ra, không ảnh hưởng tham số script từ xa của chính người dùng.
      if (!/^(?:#|;|\/\/)/.test(cnti) && /\surl(?:-and-header)?\s+script-echo-response\s+resource-parser-response\.js(?:#[^\s]*)?$/i.test(cnti)) {
        ignoredEcho.push({ rule: originalRewrite, reason: "Tham chiếu script hỗ trợ cục bộ của phiên bản cũ đã ngừng dùng, trình phân tích không thể tự triển khai file này" })
        continue
      }
      // Text inline được ưu tiên giữ hiệu quả nội dung, không tạo thêm phụ thuộc file.
      if (IsMapLocalInline(cnti)) {
        var inlineRewrite = MapLocalInline2QX(cnti, ignoredEcho)
        if (inlineRewrite) {
          cnt0.push(RuleNoteJoin(noteParts.note, RewritePatternQuoteFix(inlineRewrite)))
        }
        for (var n = failureCount; n < ignoredEcho.length; n++) { ignoredEcho[n].rule = originalRewrite }
        continue
      }
      // jq được nhận diện trước script, tránh nhầm type/pattern/http-response trong biểu thức thành tham số script.
      if (IsJsonJQRewrite(cnti)) {
        if (version < 845) {
          ignoredEcho.push({ rule: originalRewrite, reason: "jsonjq cần Quantumult X build 845 trở lên" })
          continue
        }
        cnti = JsonJQRewrite2QX(cnti)
        if (!cnti) { ignoredEcho.push({ rule: originalRewrite, reason: /^http-(?:request|response)-jq\s+http-(?:request|response)(?:-jq)?\s/i.test(originalRewrite) ? "Vị trí URL của rule jq thừa action http-request/http-response, sai định dạng nguồn" : "Rule jq thiếu URL hợp lệ, biểu thức, hoặc dấu ngoặc kép chưa đóng" }) }
      } else if (/\surl(?:-and-header)?\s+jsonjq-(?:request|response)-body\s/i.test(cnti)) {
        cnti = cnti.replace(/^\^http/, "http")
      } else if (filterRule && /^(?:AND|OR|NOT)\s*,/i.test(cnti)) {
        ignoredEcho.push({ rule: originalRewrite, reason: "Rule kết hợp logic không thể chuyển đổi trực tiếp, tách ra sẽ làm thay đổi điều kiện khớp" })
        continue
      } else if (cnti.indexOf("pattern")!=-1 && cnti.indexOf("type")!=-1 || cnti.indexOf("http-r")!=-1) {
        cnti=SGMD2QX(cnti)[0]? SGMD2QX(cnti)[0]:""
        //console.log(cnti)
      }else if ((cnti.indexOf(" 302")!=-1 || cnti.indexOf(" 307")!=-1 || (/\s(_|-)\s(reject|REJECT)/.test(cnti)) || (/\sreject$/.test(cnti)) || (/\sreject-/.test(cnti))) && cnti.indexOf(" url ")==-1 && cnti.indexOf(" url-and-header ")==-1 ){
        cnti=SGMD2QX(cnti)[0]? SGMD2QX(cnti)[0]:""
        //console.log("sss",cnti)
      }else if(cnti.indexOf(" data=")!=-1){
        cnti = SGMD2QX("[Map Local]\n"+cnti)[0]? SGMD2QX("[Map Local]\n"+cnti)[0]:""
        //cnti=cnti.replace(/ /g, "").split("data=")[0] + " url " + "reject-dict"
      }else if(cnti.indexOf("URL-REGEX")!=-1 || cnti.indexOf(" header")!=-1 || cnti.replace(/ /g,"").indexOf("hostname=")!=-1){
        cnti=SGMD2QX(cnti)[0]? SGMD2QX(cnti)[0]:""
      }else if (cnti.indexOf(" url ")!=-1 && cnti.indexOf(" simple-response ")==-1 && cnti.indexOf(" url = ")==-1){ // 2023-03-09 Bỏ simple-response loại quan
        cnti = cnti.replace("^http","http") // Bỏ ^ để khử trùng lặp
        cnti= cnti.split(" ")[1] == "url" ? cnti : ""
      } else if (cnti.indexOf(" url-and-header ")!=-1 ){ // url-and-header : ^https:xxx.com header-content url-and-header type-rule content
        cnti= cnti //cnti.split(" ")[2] == "url-and-header" ? cnti : ""
      } else if (filterRule) {
        if (Pmix==1) { cnti = Rule_Policy(cnti, ignoredEcho) }
        else { ignoredEcho.push({ rule: originalRewrite, reason: "Tài nguyên rewrite trộn phân luồng cần Quantumult X build 844 trở lên" }); cnti = "" }
      } else {
        cnti=""
      }
      if (noteParts.note) {
        for (var n = failureCount; n < ignoredEcho.length; n++) { ignoredEcho[n].rule = originalRewrite }
      }
      if (!cnti && ignoredEcho.length == failureCount && (/^\[(?:rule|url rewrite|body rewrite|map local|script)\]$/.test(section) || /\sdata-type\s*=|^http-(?:request|response)(?:\s|$)/i.test(noteParts.body))) {
        ignoredEcho.push({ rule: originalRewrite, reason: "Không nhận diện được cú pháp chuyển đổi Quantumult X đáng tin cậy cho mục này" })
      }
      if (/\surl(?:-and-header)?\s+jsonjq-(?:request|response)-body\s/i.test(cnti) && version < 845) {
        ignoredEcho.push({ rule: originalRewrite, reason: "jsonjq cần Quantumult X build 845 trở lên" })
        continue
      }
      if (cnti!="" && cnti.trim()[0]!="[" && cnti.indexOf("RULE-SET")==-1 && !/cronexp\=|type\=cron/.test(cnti.replace(/ /g,""))) { //&& !RuleK.some(RuleCheck)
        if (!(/\;$/.test(cnti))) { // Một số trường hợp đặc biệt let url = xxx;
        // echo-response gốc/đã chuyển đổi cũng loại trừ JSON inline, HTML, URL từ xa và tên file trống, chỉ giữ tham chiếu file cục bộ.
        var echo = cnti.match(/\surl(?:-and-header)?\s+echo-response\s+\S[\s\S]*?\s+echo-response(?:\s+([\s\S]*))?$/i)
        var echoBody = echo ? (echo[1] || "").trim().replace(/^(['"])([\s\S]*)\1$/, "$2") : ""
        if (echo && (!echoBody || /^(?:\{[\s\S]*\}|\[[\s\S]*\]|<[\s\S]*>)$|^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(echoBody))) {
          var echoReason = !echoBody ? "echo-response thiếu tên file nội dung cục bộ" : /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(echoBody) ? "echo-response cần file nội dung trong thư mục Data của máy, không thể tham chiếu trực tiếp URL/URI" : "echo-response không chấp nhận nội dung inline, cần file nội dung trong thư mục Data của máy"
          ignoredEcho.push({ rule: originalRewrite, reason: echoReason })
          continue
        }
        cnt0.push(RuleNoteJoin(noteParts.note, RewritePatternQuoteFix(cnti))) // Phần giải thích chỉ được gắn lại sau khi nội dung qua kiểm tra
        //$notify(cnti,"Đã ghi")
      }
      }
    }
  }
  NotifyUnsupportedRules(ignoredEcho)
  //console.log(cnt0)
  return cnt0
}



//Sắp xếp theo tên node (không tính phần emoji)
function QXSort(content, para) {
    var nlist = content;//.split("\n");
    if (para == 1) {
        return nlist.sort(ToTag)
    } else if (para == -1) {
        return nlist.sort(ToTagR)
    } else if(para == "x") {
        return shuffle(nlist)
    } else if(para == "0") {
        return nlist
    } else {
      return Sort_KWD (nlist,para) //Sắp xếp theo từ khóa
    }
}
//Thứ tự xuôi
function ToTag(elem1, elem2) {
    var tag1 = elem1.split("tag")[1].split("=")[1].trim()
    var tag2 = elem2.split("tag")[1].split("=")[1].trim()
    res = tag1 > tag2 ? 1 : -1
    return res
}
//Thứ tự ngược
function ToTagR(elem1, elem2) {
    var tag1 = elem1.split("tag")[1].split("=")[1].trim()
    var tag2 = elem2.split("tag")[1].split("=")[1].trim()
    res = tag1 > tag2 ? -1 : 1
    return res
}
// Sắp xếp xáo trộn ngẫu nhiên
function shuffle(arr) {
    var input = arr;
    for (var i = input.length - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

//Sắp xếp theo rule chỉ định
function Sort_KWD (cnt,strs) {
  strlist = strs.indexOf("<") != -1 ? strs.split("<"):strs.split(">")
  regj = strlist.map(item => RegExp(item, "i"))
  //dir = PsortX
  dir = strs.indexOf("<") != -1 ? -1:1
  var arr =  new Array(strlist.length+1);   //Bảng có n hàng
  for(var i = 0;i < arr.length; i++){
    arr[i] = [];    //Mỗi hàng có cột
  }
  for (var i =0; i<cnt.length ; i++) {
    flag = 0
    for (var j=0; j<strlist.length ; j++){
      if(regj[j].test(cnt[i])) {
        arr[j].push(cnt[i])
        flag = 1
        break
      } 
    }
    if (flag != 1){
      arr[strlist.length].push(cnt[i]) } // Mục không khớp
  }
  //console.log(arr)
  arr = PsortX == -1? arr.map(item => item.sort(ToTagR)):arr
  arr = PsortX == 1? arr.map(item => item.sort(ToTag)):arr
  newarr = MixArr(arr,dir)
  return newarr
}

function MixArr(cnt,dir){
  var cnt0=[]
  for (i=0; i<cnt.length-1; i++){
    //console.log(dir)
    cnt0 = dir ==1? cnt0.concat(cnt[i]):cnt0.concat(cnt[cnt.length-2-i])
  }
  cnt0 = dir ==1? cnt0.concat(cnt[cnt.length-1].sort(ToTag)):(cnt[cnt.length-1].sort(ToTagR)).concat(cnt0)
  return cnt0
}


//Xóa ký tự trong tên node bằng regex
function DelReg(content) {
    delreg = RegExp(delreg, "gmi")
    content=content.replace(/tag\s*\=\s*/,"tag=")
    cnt0 = content.split("tag=")[0]
    cnt1 = content.split("tag=")[1].split(",")[0]
    cnt2 = content.split("tag=")[1].split(",").length==1 ? "": content.split(cnt1)[1]
    cnt = cnt0 + "tag=" + cnt1.replace(delreg, "")+cnt2
    return cnt
}

//Đổi tên node
function Rename(str) {
    var server = str;
    if (server.indexOf("tag=") != -1) {
        hd = server.split("tag=")[0] // Phần không phải name
        name = server.split("tag=")[1].split(",")[0].trim() // Phần name
        tail = server.split("tag=")[1].split(",").length <=1 ? "" : server.split("tag=")[1].split(name)[1]
        for (var i = 0; i < Prn.length; i++) {
            nname = Prn[i].split("@")[1] ? decodeURIComponent(Prn[i].split("@")[1]) : Prn[i].split("@")[1];
            oname = Prn[i].split("@")[0] ? decodeURIComponent(Prn[i].split("@")[0]) : Prn[i].split("@")[0];
            if (oname && nname) { //Đổi tên
                var rn = escapeRegExp(oname)
                name = name.replace(new RegExp(rn, "gm"), nname)
            } else if (oname && nname == "") {//Tiền tố
                var nemoji = emoji_del(name)
                if ((Pemoji == 1 || Pemoji == 2) && Prname ) { //Kiểm tra có emoji trùng lặp không, nếu có thì xóa emoji cũ
                    name = oname + nemoji //name.replace(name.split(" ")[0] + " ", name.split(" ")[0] + " " + oname)
                } else { name = oname + name.trim() }
            } else if (nname && oname == "") {//Hậu tố
                name = name.trim() + nname
            } else if (oname && oname.indexOf("☠️") != -1) { //Xóa ký tự cụ thể, nhiều ký tự nối bằng .
                hh = Dot2(oname.slice(0, oname.length - 2)).split(".") //Xử lý đặc biệt cho ký tự .
                for (j = 0; j < hh.length; j++) {
                    var nn = escapeRegExp(ToDot(hh[j]))
                    var del = new RegExp(nn, "gm");
                    name = name.replace(del, "")
                }
            } else if (oname == "" && nname == "") { //Khi chỉ có @, xóa ký tự @
                name = name.replace(/@/g, "")
            } else {
                name = name
            }
            nserver = hd + "tag=" + name + tail
        }
      return nserver
    } else {
      return server
    }
}

function RenameScript(servers, script) {
    $notify("🤖 Bật script để đổi tên", "", script);
    try {
        const $ = Tools().rename;
        // extract server tags
        const nodes = Tools().getNodeInfo(servers);
        eval(script);
        const newNames = rename(nodes);
        // rename nodes
        return servers.map((s, i) => s.split("tag=")[0] + "tag=" + newNames[i]);
    } catch (err) {
        $notify("❌ Đổi tên bằng script gặp lỗi", "", err);
        return servers;
    }

}

//Xóa emoji 
function emoji_del(str) {
    return str.replace(/[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/g, "").trim();//unescape(escape(str).replace(/\%uD.{3}/g, ''));
}

//Thêm emoji vào tên node
function get_emoji(emojip, sname) {
   var Lmoji = { 
    "🏳️‍🌈": ["流量", "套餐", "剩余", "重置", "到期" , "时间", "应急", "过期", "Bandwidth", "expire", "Traffic", "traffic"],
    "🇴🇲": ["阿曼", " OM "],
    "🇦🇩": ["安道尔","安道爾", "Andorra"],
    "🇦🇴": ["安哥拉"],
    "🇦🇫": ["阿富汗"],
    "🇩🇿": ["阿尔及利亚","阿爾及利亞"],
    "🇫🇴": ["法羅群島","法罗群岛"],
    "🇧🇲": ["百慕大"],
    "🇦🇽": ["奧蘭群島", "奥兰群岛"],
    "🇦🇿": ["阿塞拜疆","Azerbaijan"],
    "🇦🇹": ["奥地利", "奧地利", "Austria", "维也纳"],
    "🇦🇺": ["AU", "Australia", "Sydney", "澳大利亚", "澳洲", "墨尔本", "悉尼" ,"土澳", "京澳","廣澳","滬澳","沪澳","广澳"],
    "🇧🇪": ["BE", "比利時","比利时","Belgium"],
    "🇧🇬": ["保加利亚", "保加利亞","Bulgaria"],
    "🇵🇰": ["巴基斯坦","Pakistan", "PAKISTAN"],
    "🇧🇭": ["巴林","Bahrain"],
    "🇵🇾": ["巴拉圭","Paraguay"],
    "🇧🇧": ["巴巴多斯"],
    "🇬🇶": ["赤道几内亚","赤道幾內亞"],
    "🇹🇱": ["东帝汶","東帝汶"],
    "🇰🇭": ["柬埔寨","Cambodia"],
    "🇿🇼": ["津巴布韦","津巴布韋"],
    "🇺🇦": ["烏克蘭","乌克兰","Ukraine"],
    "🇺🇿": ["乌兹别克斯坦", "烏茲別克斯坦","Uzbekistan"],
    "🇭🇷": ["克罗地亚","HR","克羅地亞", "Croatia"],
    "🇨🇦": ["CA", "Canada","CANADA", "CAN", "Waterloo", "加拿大", "蒙特利尔", "温哥华", "楓葉", "枫叶", "滑铁卢", "多伦多"],
    "🇨🇭": ["瑞士", "苏黎世", "Switzerland", "CH "],
    "🇳🇬": ["尼日利亚", "NG", "尼日利亞","拉各斯", "Nigeria"],
    "🇨🇿": ["Czechia", "捷克"],
    "🇸🇰": ["斯洛伐克", "SK" , "Slovakia"],
    "🇸🇮": ["斯洛文尼亚", "斯洛文尼亞", "Slovenia"],
    "🇦🇲": ["亚美尼亚", "亞美尼亞", "Armenia"],
    "🇷🇸": ["RS ","RS_", "塞尔维亚", "塞爾維亞", "Seville", "Sevilla"],
    "🇲🇩": ["摩爾多瓦"," MD-","摩尔多瓦", "Moldova"," MD "],
    "🇩🇪": ["DE ", "DE-", "DE_", "German", "GERMAN", "德国", "德國", "法兰克福","京德","滬德","廣德","沪德","广德"],
    "🇩🇰": ["DK","DNK","丹麦","丹麥", "Denmark"],
    "🇪🇸": ["ES", "西班牙", "Spain"],
    "🇪🇺": ["EU", "欧盟", "欧罗巴","欧洲", "European"],
    "🇫🇮": ["Finland", "芬兰","芬蘭","赫尔辛基"],
    "🇫🇷": ["FR", "France", "法国", "法國", "巴黎"],
    "🇷🇪": ["留尼汪", "留尼旺", "Réunion", "Reunion"],
    "🇨🇼": ["库拉索", "庫拉索", "Curaçao"],
    "🇬🇧": ["UK", "GB ", "England", "United Kingdom", "英国", "伦敦", "英", "Britain"],
    "🇲🇴": ["MO", "Macao","Macau", "MAC", "澳门", "澳門", "CTM"],
    "🇰🇿": ["哈萨克斯坦", "哈薩克斯坦", "Kazakhstan"],
    "🇱🇦": ["老挝","老挝", "Laos"],
    "🇭🇺": ["匈牙利", "Hungary"],
    "🇭🇳": ["洪都拉斯"],
    "🇱🇹": ["立陶宛", "Lithuania"],
    "🇱🇰": ["斯里兰卡", "斯里蘭卡", "Sri Lanka"],
    "🇧🇾": ["BY","白俄罗斯","白俄羅斯", "White Russia", "Republic of Belarus", "Belarus"],
    "🇷🇺": ["RU ","RU-", "RU_", "RUS", "Russia", "俄罗斯", "毛子", "俄国", "俄羅斯", "伯力", "莫斯科", "圣彼得堡", "西伯利亚", "新西伯利亚", "京俄", "杭俄","廣俄","滬俄","广俄","沪俄"],
    "🇸🇬": ["SG", "Singapore","SINGAPORE", "新加坡", "狮城", "獅城", "沪新", "京新", "泉新", "穗新", "深新", "杭新", "广新","廣新","滬新"],
    "🇺🇸": ["US", "USA", "America", "United States", "美国", "美", "京美", "波特兰", "达拉斯", "俄勒冈", "凤凰城", "费利蒙", "硅谷", "矽谷", "拉斯维加斯", "洛杉矶", "圣何塞", "圣荷西", "圣克拉拉", "西雅图", "芝加哥", "沪美", "哥伦布", "纽约"],
    "🇹🇼": ["TW", "Taiwan","TAIWAN", "台湾", "台北", "台中", "新北", "彰化", "CHT", "台", "HINET"],
    "🇮🇩": ["ID ","ID-", "IDN ", "Indonesia", "印尼", "印度尼西亚", "雅加达"],
    "🇮🇪": ["Ireland", "IRELAND", "IE ", "爱尔兰", "愛爾蘭", "都柏林"],
    "🇮🇱": ["Israel", "以色列"],
    "🇮🇳": ["India", "IND", "INDIA","印度", "孟买", "Mumbai","IN "],
    "🇮🇸": ["IS","ISL", "冰岛","冰島", "Iceland"],
    "🇰🇵": ["KP", "朝鲜", "North Korea","朝鮮"],
    "🇰🇷": ["KR", "Korea", "KOR", "韩国", "首尔", "韩", "韓","春川"],
    "🇬🇭": ["加纳", "Ghana", "迦納"],
    "🇱🇺": ["卢森堡", "盧森堡", "LU ", "Luxembourg"],
    "🇱🇻": ["Latvia", "Latvija", "拉脱维亚"],
    "🇧🇩": ["孟加拉", "Bengal"],
    "🇲🇽️": [" MEX", "MX", "墨西哥", "Mexico", "MEXICO"],
    "🇲🇾": [" MY", "MY-", "Malaysia","MALAYSIA", "马来西亚", "马来", "馬來", "大马", "大馬", "馬來西亞", "吉隆坡"],
    "🇲🇲": ["缅甸","緬甸"],
    "🇳🇮": ["尼加拉瓜"],
    "🇳🇱": [" NL","NL-", "Netherlands", "荷兰", "荷蘭", "尼德蘭", "阿姆斯特丹"],
    "🇵🇭": [" PH", "Philippines", "菲律宾", "菲律賓"],
    "🇷🇴": [" RO ", "罗马尼亚", "Rumania", "羅馬尼亞"],
    "🇸🇦": ["沙特", "利雅得", "Saudi Arabia", "Saudi"],
    "🇸🇪": ["SE", "Sweden","瑞典"],
    "🇹🇭": [" TH", "Thailand", "泰国", "泰國", "曼谷"],
    "🇹🇷": ["TR ","TR-", "TR_", "TUR", "Turkey", "土耳其", "伊斯坦布尔"],
    "🇻🇳": ["VN", "越南", "胡志明市", "Vietnam"],
    "🇮🇹": ["Italy", " IT ", "Nachash", "意大利", "米兰", "義大利"],
    "🇿🇦": ["South Africa", "南非", "Johannesburg"],
    "🇦🇪": ["United Arab Emirates", "阿联酋","AE ", "迪拜", "阿聯酋", "Dubai"],
    "🇧🇷": ["BR", "Brazil", "巴西", "圣保罗"],
    "🇯🇵": ["JP", "Japan","JAPAN", "日本", "东京", "大阪", "埼玉", "京日", "苏日", "沪日","上日", "穗日", "川日", "中日", "泉日", "杭日", "深日", "辽日", "广日", "Tokyo"],
    "🇦🇷": ["AR ", "Argentina", "阿根廷","AR-"],
    "🇳🇴": ["Norway", "挪威", "NO"],
    "🇵🇱": [" PL", "POL", "波兰","波蘭", "Poland"],
    "🇨🇱": ["智利","Chile","CHILE"],
    "🇳🇿": ["新西蘭","新西兰", "New Zealand"],
    "🇬🇷": ["希腊","希臘", "Greece"],
    "🇪🇬": ["埃及", "Egypt"],
    "🇮🇲": ["马恩岛","馬恩島", "Isle of Man", "Mannin"],
    "🇵🇹": ["葡萄牙", "Portugal"],
    "🇲🇳": ["蒙古", "Mongolia"],
    "🇵🇪": ["秘鲁","祕魯", "Peru"],
    "🇨🇴": ["哥伦比亚", "哥倫比亞", "Colombia"],
    "🇪🇪": ["爱沙尼亚", "愛沙尼亞", "Estonia"],
    "🇱🇾": ["利比亚","利比亞", "Libya"],
    "🇲🇰": ["马其顿","馬其頓", "Macedonia"],
    "🇲🇹": ["马耳他", "馬其他", "Malta"],
    "🇻🇪": ["委内瑞拉", "Venezuela"],
    "🇧🇦": ["波黑共和国","波黑", "Bosnia and Herzegovina"],
    "🇬🇪": ["格魯吉亞","格鲁吉亚", "Georgia"],
    "🇦🇱": ["阿爾巴尼亞","阿尔巴尼亚", "Albania"],
    "🇨🇾": ["CY","塞浦路斯", "Cyprus"],
    "🇨🇷": ["哥斯达黎加", "哥斯達尼加", "Costa Rica"],
    "🇹🇳": ["突尼斯", "Tunisia"],
    "🇻🇦": ["梵蒂冈","梵蒂岡"],
    "🇷🇼": ["卢旺达","盧旺達"],
    "🇵🇦": ["巴拿马","巴拿馬", "Panama"],
    "🇮🇷": ["伊朗", "Iran"],
    "🇯🇴": ["约旦", "約旦", "Jordan"],
    "🇺🇾": ["乌拉圭" , "烏拉圭", "Uruguay"],
    "🇰🇪": ["肯尼亚", "肯尼亞", "Kenya"],
    "🇰🇬": ["吉尔吉斯坦","吉尔吉斯斯坦", "Kyrghyzstan"],
    "🇳🇵": ["尼泊尔", "尼泊爾", "Nepal"],
    "🇽🇰": ["科索沃", "Kosovo"],
    "🇲🇦": ["摩洛哥", "Morocco"],
    "🇪🇨": ["厄瓜多尔", "厄瓜多爾", "EC", "Ecuador"],
    "🇲🇺": ["毛里求斯", "Mauritius"],
    "🇵🇷": ["波多黎各", "PR ","PR-", "Puerto Rico"],
    "🇬🇹": ["危地马拉", "危地馬拉", " GT "],
    "🇭🇰": ["HK", "Hongkong", "Hong Kong", "HongKong", "HONG KONG","香港", "深港", "沪港", "呼港", "HKT", "HKBN", "HGC", "WTT", "CMI", "穗港", "京港", "港"],
    "🇨🇳": ["CN", "China", "回国", "中国","中國", "江苏", "北京", "上海", "广州", "深圳", "杭州", "徐州", "青岛", "宁波", "镇江", "back"],
    "🇨🇺": ["古巴"],
    "🇸🇲": ["圣马力诺","聖馬利諾"],
    "🇰🇾": ["开曼群岛","開曼群島"],
    "🇫🇯": ["斐济","斐濟"],
    "🇬🇱": ["格陵兰","格陵蘭"],
    "🇬🇮": ["直布罗陀","直布羅陀"],
    "🇲🇪": ["黑山"],
    "🇱🇮": ["列支敦士登"],
    "🇬🇺": ["关岛","關島"],
    "🇦🇶": ["南极","南極"],
    "🇧🇹": ["不丹"], 
    "🇲🇻": ["马尔代夫", "馬爾代夫"],
    "🇮🇶": ["伊拉克"],
    "🇸🇨": ["塞舌尔","塞舌爾"],
    "🇶🇦": ["卡塔尔", "卡塔爾", " QA "],
    "🇸🇾": ["叙利亚", "敘利亞", " SY "],
    "🇱🇧": ["黎巴嫩","LB", "Lebanon"],
    "🇧🇳": ["文莱","汶萊", "BRN","Negara Brunei Darussalam"],
    "🇨🇻": ["佛得角"],
    "🇸🇷": ["苏里南","蘇里南"],
    "🇲🇨": ["摩纳哥","摩納哥"],
    "🇯🇲": ["牙买加","牙買加 "],
    "🌏": ["亚洲","Asia"],
    "🇹🇬": ["多哥"],
    "🇵🇸": ["巴勒斯坦"],
    "🇬🇫": ["法屬圭亞那","法属圭亚那"],
    "🇹🇹": ["特立尼达和多巴哥","特立尼達和多巴哥"]
  }
    str1 = JSON.stringify(Lmoji)
    aa = JSON.parse(str1)
    bb = JSON.parse(str1.replace(/🇹🇼/g, " 🇨🇳"))
    var cnt = emojip ==1? aa:bb;
    var flag = 0;
    for (var key in cnt) {
        dd = cnt[key]
        for (i in dd) {
            if (sname.indexOf(dd[i]) != -1) {
                flag = 1;
                nname = key + " " + sname.replace(/[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/g, "").trim(); // use regex to remove the original flag
                return [nname,key]
            }
        }
    }
    if (flag == 0) { return ["🏴‍☠️ " + sname.replace(/[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/g, "").trim(), "🏴‍☠️"] }
}

//Xử lý emoji
function emoji_handle(servers, Pemoji) {
    var nlist = []
    var ser0 = servers

    for (var i = 0; i < ser0.length; i++) {
        if (ser0[i].indexOf("tag=") != -1) {
            var oname = ser0[i].split("tag=")[1].trim();
            var hd = ser0[i].split("tag=")[0];
            var nname = oname;//emoji_del(oname);
            // Code: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2, Emoji: https://emojipedia.org/flags/
            if (Pemoji == 1) {
                var nname = get_emoji(1, nname)[0]
            } else if (Pemoji == 2) {
                var nname = get_emoji(2, nname)[0]
            } else if (Pemoji == -1) {
                nname = emoji_del(oname);
            }
            var nserver = hd + "tag=" + nname.replace("  ", " ").trim()
            nlist.push(nserver)
        }
    }
    return nlist
}

//Hàm chính chuyển đổi Surge2QX
function Surge2QX(conf) {
  var QXlist = conf.split("\n").map(isSurge).filter(Boolean)
  var Nlist = []
  var node=""
  for (var i = 0; i < QXlist.length; i++) {
    var cnt = QXlist[i];
    if (cnt.split("=")[1].split(",")[0].indexOf("trojan") != -1) {
      node = Strojan2QX(cnt)//trojan của surge 3
    } else if (cnt.split("=")[1].split(",")[0].indexOf("http") != -1) {
      node = Shttp2QX(cnt) //http của surge 3
    } else if (cnt.split("=")[1].split(",")[0].indexOf("vmess") != -1) {
      node = SVmess2QX(cnt) //Vmess của surge 3
    } else if (cnt.split("=")[1].split(",")[0].indexOf("ss") != -1) {
      node = SSS2QX(cnt) //SS của surge 3
    } else if (cnt.split("=")[1].split(",")[0].indexOf("socks5") != -1) {
      node = SS52QX(cnt) //Socks5 của surge 3
    } else if (cnt.split("=")[1].split(",")[0].indexOf("custom") != -1) {
      node = SCT2QX(cnt) //Cách viết surge2
    } else if (cnt.split("=")[1].split(",")[0].indexOf("anytls") != -1 && version>913) {
      node = SATS2QX(cnt) // surge anytls from version 913 afterward
    }
    node = Pudp0 != 0 ? XUDP(node,Pudp0) : node
    node = Ptfo0 != 0 ? XTFO(node,Ptfo0) : node
    if (cnt.indexOf("test-url") !=-1) {
      var checkurl = ", server_check_url" + cnt.split("test-url")[1].split(",")[0]
      node = node.replace(/\,(\s)*tag/, checkurl + ", tag")
    }
    Nlist.push(node)
  }
  return (Nlist)
}


// Cách viết loại SS trong surge2 (custom)
//🇷🇺 俄罗斯 GIA = custom, ip, 152, aes-128-gcm, password123, https://xxx/download/SSEncrypt.module, obfs=tls, obfs-host=xxx.windows.com, udp-relay=true
function SCT2QX(content) {
    var cnt = content;
    var tag = "tag=" + cnt.split("=")[0].trim();
    var ipport = cnt.split(",")[1].trim() + ":" + cnt.split(",")[2].trim();
    var pmtd = "method=" + cnt.split(",")[3].trim();
    var pwd = "password=" + cnt.split(",")[4].trim();
    if (cnt.indexOf("obfs") != -1) {
        pobfs = "obfs=" + cnt.replace(/obfs-host/, "").split("obfs")[1].split(",")[0].split("=")[1]
    } else { pobfs = "" }
    var phost = cnt.indexOf("obfs-host") != -1 ? "obfs-host" + cnt.split("obfs-host")[1].split(",")[0].trim() : "";
    if (phost != "") {
        pobfs = pobfs + ", " + phost
    }
    var ptfo = paraCheck(cnt, "tfo") == "true" ? "fast-open=true" : "fast-open=false";
    var pudp = paraCheck(cnt, "udp-relay") == "true" ? "udp-relay=true" : "udp-relay=false";
    var nserver = pobfs != "" ? "shadowsocks= " + [ipport, pmtd, pwd, pobfs, ptfo, pudp, tag].join(", ") : "shadowsocks= " + [ipport, pmtd, pwd, ptfo, pudp, tag].join(", ");
    return nserver
}


// Loại SS trong surge3
function SSS2QX(content) {
    var cnt = content;
    var cnts=cnt.replace(" ","").replace("\"","")
    var tag = "tag=" + cnt.split("=")[0].trim();
    var ipport = cnt.split(",")[1].trim() + ":" + cnt.split(",")[2].trim();
    var pmtd = "method=" + cnt.split("encrypt-method")[1].split(",")[0].split("=")[1];
    var pwd = "password=" + cnts.split("password=")[1].split(",")[0].replace("\"","")//.split("\"")[0];
    if (cnt.indexOf("obfs") != -1) {
        pobfs = "obfs=" + cnt.replace(/obfs-host/, "").split("obfs")[1].split(",")[0].split("=")[1]
    } else { pobfs = "" }
    var phost = cnt.indexOf("obfs-host") != -1 ? "obfs-host" + cnt.split("obfs-host")[1].split(",")[0].trim() : "";
    if (phost != "") {
        pobfs = pobfs + ", " + phost
    }
    var ptfo = paraCheck(cnt, "tfo") == "true" ? "fast-open=true" : "fast-open=false";
    var pudp = paraCheck(cnt, "udp-relay") == "true" ? "udp-relay=true" : "udp-relay=false";
    var nserver = pobfs != "" ? "shadowsocks= " + [ipport, pmtd, pwd, pobfs, ptfo, pudp, tag].join(", ") : "shadowsocks= " + [ipport, pmtd, pwd, ptfo, pudp, tag].join(", ");
    return nserver
}


// Loại Vmess trong surge
function SVmess2QX(content) {
    var cnt = content;
    var tag = "tag=" + cnt.split("=")[0].trim();
    var ipport = cnt.split(",")[1].trim() + ":" + cnt.split(",")[2].trim();
    var puname = cnt.indexOf("username") != -1 ? "password=" + cnt.split("username")[1].split(",")[0].split("=")[1].trim() : "";
    var pmtd = "method=aes-128-gcm";
    var ptls13 = paraCheck(cnt, "tls13") == "true" ? "tls13=true" : "tls13=false";
    var pverify = TLSCertParam(Pcert0, cnt.replace(/ /g,"").indexOf("skip-cert-verify=false") != -1 ? "true" : "false");
    if (paraCheck(cnt.replace(/tls13/, ""), "tls") == "true" && paraCheck(cnt.replace(/ws-header/, ""), "ws") == "true") {
        pobfs = "obfs=wss" + ", " + ptls13 + ", " + pverify
    } else if (paraCheck(cnt.replace(/ws-header/, ""), "ws") == "true") {
        pobfs = "obfs=ws"
    } else if (paraCheck(cnt.replace(/tls13/, ""), "tls") != "false") {
        pobfs = "obfs=over-tls" + ", " + ptls13 + ", " + pverify
    } else if (paraCheck(cnt.replace(/ws-header/, ""), "ws") == "false") {
        pobfs = ""
    }
    var puri = paraCheck(cnt, "ws-path") != "false" ? "obfs-uri=" + cnt.split("ws-path")[1].split(",")[0].split("=")[1].trim() : "obfs-uri=/"
    var phost = cnt.indexOf("ws-headers") != -1 ? "obfs-host=" + cnt.split("ws-headers")[1].split(",")[0].split("=")[1].split(":")[1].trim() : "";
    if (pobfs.indexOf("ws" || "wss") != -1) {
        if (phost != "") {
            pobfs = pobfs + ", " + puri + ", " + phost
        } else { pobfs = pobfs + ", " + puri }
    }
    var ptfo = paraCheck(cnt, "tfo") == "true" ? "fast-open=true" : "fast-open=false";
    var nserver = pobfs != "" ? "vmess= " + [ipport, puname, pmtd, pobfs, ptfo, tag].join(", ") : "vmess= " + [ipport, puname, pmtd, ptfo, tag].join(", ");
    return nserver
}

// Dùng để lọc phần không phải node (ví dụ nội dung khác trong toàn bộ cấu hình)
function isSurge(content) {
  if (content.indexOf("=") != -1) {
    cnt = content.split("=")[1].split(",")[0].trim()
    if (cnt == "http" || cnt == "ss" || cnt == "trojan" || cnt == "vmess" || cnt == "custom" || cnt == "https" || cnt == "socks5"|| cnt == "socks5-tls"|| cnt == "anytls") {
        return content
    }
  }
}
// Dùng để kiểm tra tham số
function paraCheck(content, para) {
  content=content.replace(/ /g,"")
  if (content.indexOf(para+"=") == -1) {
    return "false"
  } else {
      //console.log(para)
    return content.split(para+"=")[1].split(",")[0].trim()
  }
}
//Chuyển đổi loại trojan trong surge
function Strojan2QX(content) {
  var cnt = content;
  var tag = "tag=" + cnt.split("=")[0].trim();
  var ipport = cnt.split(",")[1].trim() + ":" + cnt.split(",")[2].trim();
  var pwd = "password=" + cnt.split("password")[1].split(",")[0].split("=")[1].trim();
  var ptls = "over-tls=true";
  var ptfo = paraCheck(cnt, "tfo") == "true" ? "fast-open=true" : "fast-open=false";
  var pverify = TLSCertParam(Pcert0, cnt.replace(/ /g,"").indexOf("skip-cert-verify=false") != -1 ? "true" : "false");
  var phost = cnt.indexOf("sni")!=-1? "tls-host="+cnt.split("sni")[1].split(",")[0].split("=")[1]:""
  var ptls13 = paraCheck(cnt, "tls13") == "true" ? "tls13=true" : "tls13=false";
  var nserver = "trojan= " + [ipport, pwd, ptls, ptfo, ptls13, phost,pverify, tag].filter(Boolean).join(", ");
  return nserver
}

// Chuyển đổi loại anytls trong surge
function SATS2QX(content) {
  try {
    var cnt = content;
    if (Pdbg==1) {$notify(cnt)}
    var tag = "tag=" + cnt.split("=")[0].trim();
    var ipport = cnt.split(",")[1].trim() + ":" + cnt.split(",")[2].trim();
    var pwd = "password=" + cnt.split("password")[1].split(",")[0].split("=")[1].trim();
    var ptls = "over-tls=true";
    //var ptfo = paraCheck(cnt, "tfo") == "true" ? "fast-open=true" : "fast-open=false";
    var pverify = TLSCertParam(Pcert0, cnt.replace(/ /g,"").indexOf("skip-cert-verify=false") != -1 ? "true" : "false");
    var phost = cnt.indexOf("sni")!=-1? "tls-host="+cnt.split("sni")[1].split(",")[0].split("=")[1]:""
    pudp = Pudp0 == -1 ? "udp-relay=false" : "udp-relay=true" // Mặc định bật
    var nserver = "anytls= " + [ipport, pwd, ptls, pverify, phost,pudp, tag].filter(Boolean).join(", ");
    return nserver
  } catch (error) {
    console.log("surge-anytls:"+error)
  }
}


// Loại http trong surge
function Shttp2QX(content) {
  var cnt = content;
  var tag = "tag=" + cnt.split("=")[0].trim();
  var ipport = cnt.split(",")[1].trim() + ":" + cnt.split(",")[2].trim();
  var puname = cnt.indexOf("username") != -1 ? "username=" + cnt.split("username")[1].split(",")[0].split("=")[1].trim() : "";
  var pwd = cnt.indexOf("password") != -1 ? "password=" + cnt.split("password")[1].split(",")[0].split("=")[1].trim() : "";
  var ptls = cnt.split("=")[1].split(",")[0].trim() == "https" ? "over-tls=true" : "over-tls=false";
  var ptfo = paraCheck(cnt, "tfo") == "true" ? "fast-open=true" : "fast-open=false";
  if (ptls == "over-tls=true") {
    var pverify = TLSCertParam(Pcert0, cnt.replace(/ /g,"").indexOf("skip-cert-verify=false") != -1 ? "true" : "false");
    var ptls13 = paraCheck(cnt, "tls13") == "true" ? "tls13=true" : "tls13=false";
    ptls = ptls + ", " + pverify + ", " + ptls13
  }
  var nserver = puname != "" ? "http= " + [ipport, puname, pwd, ptls, ptfo, tag].join(", ") : "http= " + [ipport, ptls, ptfo, tag].join(", ");
  return nserver
}

// Loại socks5 trong surge
function SS52QX(content) {
  var cnt = content;
  var tag = "tag=" + cnt.split("=")[0].trim();
  var ipport = cnt.split(",")[1].trim() + ":" + cnt.split(",")[2].trim();
  var puname = cnt.indexOf("username") != -1 ? "username=" + cnt.split("username")[1].split(",")[0].split("=")[1].trim() : "";
  var pwd = cnt.indexOf("password") != -1 ? "password=" + cnt.split("password")[1].split(",")[0].split("=")[1].trim() : "";
  var ptls = cnt.split("=")[1].split(",")[0].trim() == "socks5-tls" ? "over-tls=true" : "over-tls=false";
  var ptfo = paraCheck(cnt, "tfo") == "true" ? "fast-open=true" : "fast-open=false";
  if (ptls == "over-tls=true") {
    var pverify = TLSCertParam(Pcert0, cnt.replace(/ /g,"").indexOf("skip-cert-verify=false") != -1 ? "true" : "false");
    var ptls13 = paraCheck(cnt, "tls13") == "true" ? "tls13=true" : "tls13=false";
    ptls = ptls + ", " + pverify + ", " + ptls13
  }
  var nserver = puname != "" ? "socks5= " + [ipport, puname, pwd, ptls, ptfo, tag].join(", ") : "socks5= " + [ipport, ptls, ptfo, tag].join(", ");
  return nserver
}

function Loon2QX(cnt) {
  var type = cnt.split("=")[1].split(",")[0].trim()
  var node = ""
  if (type == "Shadowsocks") { //loại ss
      node = LoonSS2QX(cnt)
  } else if (type == "ShadowsocksR") { //loại ssr
      node = LoonSSR2QX(cnt)
  } else if (type == "Trojan") { // loại trojan
      node = LoonTJ2QX(cnt)
  } else if (type == "VLESS") { // loại vless
    node = LoonVL2QX(cnt)
  } else if (type == "AnyTLS" && version > 913) { // loại anytls
    node = LoonTLS2QX(cnt)
  }
  return node
}

// Giải thích sửa lỗi chuyển đổi Loon Trojan ⟦2026-08-11 14:25:35 +08⟧
// Mật khẩu Trojan của Loon nằm ở trường dấu phẩy thứ 4, không thể dùng lại logic lấy giá trị password= của Surge.
function LoonTJ2QX(cnt) {
  var tag = "tag=" + cnt.split("=")[0].trim();
  var ipport = [cnt.split(",")[1].trim(), cnt.split(",")[2].trim()].join(":");
  var pwd = "password=" + cnt.split(",")[3].trim().replace(/^\"|\"$/g, "");
  var phost = cnt.indexOf("sni=") != -1 ? "tls-host=" + cnt.split("sni=")[1].split(",")[0].trim() : "";
  var pverify = TLSCertParam(Pcert0, cnt.replace(/ /g, "").indexOf("skip-cert-verify=false") != -1 ? "true" : "false");
  var pudp = paraCheck(cnt, "udp") == "true" ? "udp-relay=true" : "udp-relay=false";
  return "trojan=" + [ipport, pwd, "over-tls=true", pverify, phost, pudp, tag].filter(Boolean).join(", ");
}

//Phần ss của Loon
function LoonSS2QX(cnt) {
  var node = "shadowsocks="
  var ip = [cnt.split(",")[1].trim(), cnt.split(",")[2].trim()].join(":")
  var mtd = "method=" + cnt.split(",")[3].trim()
  var pwd = "password=" + cnt.split(",")[4].trim().split("\"")[1]
  var obfs = cnt.split(",").length == 7 ? ", " + ["obfs=" + cnt.split(",")[5].trim(), "obfs-host=" + cnt.split(",")[6].trim()].join(",") : ""
  var tag = ", tag=" + cnt.split("=")[0].trim()
  node = node + [ip, mtd, pwd].join(", ") + obfs + tag
  return node
}

//Phần ssr của Loon
//# Định dạng SSR: tên=loại giao thức, địa chỉ, cổng, phương thức mã hóa, mật khẩu, loại giao thức, {tham số giao thức}, loại obfs, {tham số obfs}
//3 = ShadowsocksR, 1.2.3.4, 443, aes-256-cfb,"password",auth_aes128_md5,{},tls1.2_ticket_auth,{}
function LoonSSR2QX(cnt) {
  var node = "shadowsocks="
  var ip = [cnt.split(",")[1].trim(), cnt.split(",")[2].trim()].join(":")
  var mtd = "method=" + cnt.split(",")[3].trim()
  var pwd = "password=" + cnt.split(",")[4].trim().split("\"")[1]
  var ssrp = "ssr-protocol=" + cnt.split(",")[5].trim()
  var ssrpara = "ssr-protocol-param=" + cnt.split(",")[6].replace(/\{|\}/g, "").trim()
  var obfs = "obfs=" + cnt.split(",")[7].trim()
  var obfshost = "obfs-host=" + cnt.split(",")[8].replace(/\{|\}/g, "").trim()
  var tag = ", tag=" + cnt.split("=")[0].trim()
  node = node + [ip, mtd, pwd, ssrp, ssrpara, obfs, obfshost].join(", ") + tag
  return node
}

// read parameters
function param1(res,org,mbody) {
  mbodys=mbody.replace(/\s/g,"")
  if(mbodys.indexOf(org)!=-1) {
    tmp=mbodys.split(org)[1].split("=")[1].split(",")[0].replace(/\"/g,"")
    return res+"="+tmp
  }
  else return ""
}

//Phần VLESS của Loon
//vls = VLESS,1.1.1.1,443,"b0dd64e4-0fbd-4038-9139-d1f32a68a0dc",transport=ws,path=patha,host=host.com,udp=true,over-tls=true,tls-name=sni.co
//2025-12-31 add reality part support
//vls-name = VLESS,ip,port,"pwd",transport=tcp,flow=xtls-rprx-vision,public-key="pbk",short-id=sid,udp=true,block-quic=true,over-tls=true,sni=sni.com
function LoonVL2QX(cnt) {
  var tag = ", tag=" + cnt.split("=")[0].trim()
  cnt=cnt.replace(" ","") //Bỏ khoảng trắng, đơn giản hóa 
  var node = "vless="
  var ip = [cnt.split(",")[1].trim(), cnt.split(",")[2].trim()].join(":")
  var mtd = "method=none"
  var pwd = "password=" + cnt.split(",")[3].trim().split("\"")[1]
  if (cnt.indexOf("transport=tcp")!=-1) {
    obfs= cnt.indexOf("over-tls=true")=="-1"? "":"obfs=over-tls"
  } else if (cnt.indexOf("transport=http")!=-1) {
    obfs="obfs=http"
  } else if (cnt.indexOf("transport=ws")!=-1) {
    obfs= cnt.indexOf("over-tls=true")=="-1"? "obfs=ws":"obfs=wss"
  }
  vpath = cnt.indexOf("path=")==-1? "":"obfs-uri="+cnt.split("path=")[1].split(",")[0]
  if (cnt.indexOf("host=")!=-1) {
    obfshost="obfs-host="+cnt.split("host=")[1].split(",")[0]
  }  else if (cnt.indexOf("tls-name=")!=-1) {
    obfshost="obfs-host="+cnt.split("tls-name=")[1].split(",")[0]
  } else if (cnt.indexOf("sni=")!=-1) {
    obfshost="obfs-host="+cnt.split("sni=")[1].split(",")[0]
  }
  vflow=param1("vless-flow","flow",cnt)
  vpbk=param1("reality-base64-pubkey","public-key",cnt)
  vsid=param1("reality-hex-shortid","short-id",cnt)
  node = node + [ip, mtd, pwd, obfs, obfshost, vpath,vflow,vpbk,vsid].filter(Boolean).join(", ") + tag
  return node
}

// loon anytls
//loon-tls = AnyTLS,1.1.1.1,443,"jdjdhd",sni=abc.com,skip-cert-verify=true,udp=true,block-quic=false
function LoonTLS2QX(content) {
  try {
    var cnt = content;
    $notify("Loon","",cnt)
    if (Pdbg==1) {$notify(cnt)}
    var tag = "tag=" + cnt.split("=")[0].trim();
    var ipport = [cnt.split(",")[1].trim(), cnt.split(",")[2].trim()].join(":");
    var pwd = "password=" +  + cnt.split(",")[3].trim().split("\"")[1];
    var ptls = "over-tls=true";
    var phost = cnt.indexOf("sni")!=-1? "tls-host="+cnt.split("sni")[1].split(",")[0].split("=")[1]:""
    pudp = Pudp0 == -1 ? "udp-relay=false" : "udp-relay=true" // Mặc định bật
    var pverify = TLSCertParam(Pcert0, cnt.replace(/ /g,"").indexOf("skip-cert-verify=false") != -1 ? "true" : "false");
    var nserver = "anytls= " + [ipport, pwd, ptls, pverify, phost,pudp, tag].filter(Boolean).join(", ");
    $notify("Loon","",nserver)
    return nserver
  } catch (error) {
    console.log("loon-anytls:"+error)
  }

}

////////////////////

/*
Giải thích sửa lỗi YAMLFix ⟦2026-07-02 10:23:41 HKT⟧
----------------------------------------------------------
Chỉ thay đổi resource-parser-r.js.
Sửa lỗi dấu phẩy trong dấu ngoặc kép của inline YAML map bị tách hỏng:
  - Không còn xóa dấu ngoặc kép của value rồi replace toàn cục (/ ,/g, "\n   ")
  - Đổi thành chỉ tách dấu phẩy ở cấp cao nhất, giữ lại "VM, WS", "pa,ss" và {path:..., headers:{...}} lồng nhau
----------------------------------------------------------
*/
function YAMLFix(cnt){
  function splitInlineYamlMapItems(str) {
    var parts = [];
    var buf = "";
    var quote = "";
    var escaped = false;
    var depth = 0;
    var leftBracketToken = "yaml@bug𝟙";
    for (var i = 0; i < str.length; i++) {
      var ch = str[i];
      if (quote) {
        buf += ch;
        if (quote == "\"" && ch == "\\" && !escaped) {
          escaped = true;
          continue;
        }
        if (quote == "'" && ch == "'" && str[i + 1] == "'") {
          buf += str[++i];
          continue;
        }
        if (ch == quote && !escaped) {
          quote = "";
        }
        escaped = false;
      } else if (str.slice(i, i + leftBracketToken.length) == leftBracketToken) {
        depth++;
        buf += leftBracketToken;
        i += leftBracketToken.length - 1;
      } else if (ch == "\"" || ch == "'") {
        quote = ch;
        buf += ch;
      } else if (ch == "{" || ch == "[") {
        depth++;
        buf += ch;
      } else if (ch == "}" || ch == "]") {
        depth--;
        buf += ch;
      } else if (ch == "," && depth == 0) {
        if (buf.trim() != "") {
          parts.push(buf.trim());
        }
        buf = "";
      } else {
        buf += ch;
      }
    }
    if (buf.trim() != "") {
      parts.push(buf.trim());
    }
    return parts;
  }

  function expandInlineYamlMapLine(line) {
    var match = line.match(/^(\s*)-\s*(\{[\s\S]*\})\s*(?:#.*)?$/);
    if (!match) {
      return line;
    }
    var indent = match[1];
    var body = match[2].trim().slice(1, -1);
    var parts = splitInlineYamlMapItems(body);
    if (parts.length == 0) {
      return line;
    }
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      out.push((i == 0 ? indent + "- " : indent + "  ") + parts[i]);
    }
    return out.join("\n");
  }

  cnt = cnt.replace(/\[/g,"yaml@bug𝟙").replace(/\\r/g,"").replace(/\*/g,"yaml@bug𝟚")
  //2022-08-08 Thêm .replace(/\*/g,"🌟@bug2") để giải quyết một số vấn đề khi tên bắt đầu bằng *
  if (cnt.indexOf("{") != -1 && /\{\s*\"*(name|type|server)/.test(cnt)){ // loại yaml - { }
    cnt =  cleanYamlSpaces(cnt) // 2026-02-06 Lỗi phân tích một phần khoảng trắng
    cnt = cnt.replace(/(^|\n)- /g, "$1  - ").replace(/    - /g,"  - ")
    //2022-04-11 remove tls|skip from replace(/, (Host|host|path|mux)/g,",   $1")
    console.log("1st:\n"+cnt)
    cnt = cnt.split("\n").map(expandInlineYamlMapLine).join("\n").replace(/, short-id\"{0,1}/gi,", short-id")
  }
  cnt = cnt.replace(/\n\s*\-\s*\n.*name/g,"\n  - name").replace(/\$|\`/g,"").split("proxy-providers:")[0].split("proxy-groups:")[0].replace(/\"(name|type|server|port|cipher|password|uuid|alterId|udp)(\"*)/g,"$1")
    if(Pdbg == 1) {
  $notify("part-fix0:","","part-fix0:\nproxies:\n"+cnt.split("proxies:")[1])}
  // Sửa thụt lề
  // old 2023-03-23  👇Sửa một số loại 
  // cnt = cnt.replace(/\n\s{2}([a-zA-Z]+.*\:)/g,"\n    $1").replace(/\n(\-.*)/g,"\n  $1")
  //new  2026-01-08 
  cnt = /\n\-\s[a-zA-Z]/.test(cnt)? cnt.replace(/\n(.*(\:|\-))/g,"\n  $1"):cnt.replace(/\n\s{2}([a-zA-Z]+.*\:)/g,"\n    $1").replace(/\n(\-.*)/g,"\n  $1")
  if(Pdbg == 1) {
  $notify("part-fix1:","","part-fix1:\nproxies:\n"+cnt.split("proxies:")[1])}
  // cnt = cnt.indexOf("proxies:") == -1? "proxies:\n" + cnt :"proxies:"+cnt.split("proxies:")[1]
  cnt = cnt.replace(/name\:(.*?)\:(.*?)\n/gmi,"name:$1冒号$2\n").replace(/\s{6}Host\:/g,"      Host:")//.replace(/\{\s*(Host\:.*)\}/gmi,"$1") //Sửa trường hợp bug hiếm gặp
  items=cnt.split("\n").map(yamlcheck)
  cnt=items.join("\n")
  //console.log(cnt.replace(/name\:(.*?)\:(.*?)\n/gmi,"name:$1冒号$2"))
  //2022-05-11 Thêm ⬇️
  //cnt = cnt.replace(/\n\s{4}headers/g,"\n      headers").replace(/\n\s{6}(H|h)ost/g,"\n        Host").replace(/\t/g,"")
  //2022-06-07 Đổi thành 👇, giải quyết trường hợp một số không có trường proxies
  //2022-09-01 remove host in s{6}(H|h)ost
  //cnt = cnt.indexOf("proxies:") != -1?cnt.replace(/\n\s{4}headers/g,"\n      headers").replace(/\n\s{6}Host/g,"\n        Host").replace(/\t/g,""):cnt
  //2022-11-29 Sửa đổi
  cnt = cnt.indexOf("proxies:") != -1 && /\n\s{4}server/.test(cnt)  ? cnt.replace(/\n\s{4}(headers|path)/g,"\n      $1").replace(/\n\s{6}Host/g,"\n        Host").replace(/\t/g,""):cnt
  //console.log("part-fix:\n"+cnt.split("proxies:")[1])
  cnt = cnt.indexOf("proxies:") == -1? "proxies:\n" + cnt :"proxies:"+cnt.split("proxies:")[1]
  cnt = cnt.replace(/>/g,"⟩") // 2026-02-02 Một số vấn đề kỳ lạ
  //cnt=cnt.replace(/yaml@bug𝟙/g,"[").replace(/冒号/gmi,":").replace(/yaml@bug𝟚/g,"*")
  console.log("after-fix\n"+cnt)
  if(Pdbg == 1) {
  $notify("After-Fix","this is", "After-fix:\n"+cnt)}
  //$notify("After-Fix","this is", cnt)

  return cnt
}

// 2026-02-06 Sửa lỗi khoảng trắng yaml {}
function cleanYamlSpaces(yamlText) {
  return yamlText.split('\n').map(line => {
    if (line.includes('{') && line.includes('}')) {
      return '  ' + line.trim().replace(/ {2,}/g, ' ');
    }
    return line;
  }).join('\n');
}

function yamlcheck(cnt){
  if (cnt.indexOf("name") !=-1){ //Khi tên kết thúc bằng một số con số nhất định, phân tích gặp bug
    for (var i=0;i<10;i++) {
      cnt = cnt.replace(new RegExp(patn[0][i], "gmi"),patn[4][i])
    }
    
  }
  if (/(:)/.test(cnt) && !/alpn\s*\:/.test(cnt)) {
    return cnt
  }
}

//2026-01-07

/**
* Chuyển chuỗi đối tượng JS không chuẩn thành đối tượng JSON chuẩn
*/
function superMagicParse(str) {
  let s = str;
  $notify(1,1,s)
  // 1. Sửa cấu trúc: giải quyết vấn đề "...right"]" thiếu "}"
  // Logic: nếu phát hiện tổ hợp dấu hai chấm+giá trị+"]", nghĩa là thiếu một "}", đổi thành "}]"
  // (Ở đây tương thích cả trường hợp giá trị có hoặc không có dấu ngoặc kép)
  s = s.replace(/(:\s*(?:".*?"|[^,}\]]+?))\s*]/g, '$1}]');
  $notify(1,2,s)
  // 2. Bổ sung dấu ngoặc kép cho Key
  // Logic: khớp ký tự bắt đầu bằng { hoặc ,, sau đó là "ký tự bất kỳ không phải dấu hai chấm", cho đến dấu hai chấm
  // Cho phép key chứa chữ cái, chữ số, dấu gạch dưới, dấu gạch ngang - v.v.
  s = s.replace(/([{\s,])([a-zA-Z0-9_\-]+)\s*:/g, '$1"$2":');
  
  // 3. Bổ sung dấu ngoặc kép cho Value (phần sửa đổi cốt lõi)
  // Logic: khớp dấu hai chấm, sau đó bắt một chuỗi ký tự "không phải dấu ngoặc kép, không phải dấu phẩy, không phải dấu ngoặc"
  s = s.replace(/:\s*([^",}\]]+?)\s*(?=[,}\]])/g, (match, rawValue) => {
    const val = rawValue.trim();
    
    // A. Nếu là số thuần túy, giữ nguyên (hỗ trợ số âm và số thập phân)
    if (!isNaN(Number(val))) {
      return `:${val}`;
    }
    
    // B. Nếu là từ khóa, giữ nguyên
    if (['true', 'false', 'null', 'undefined'].includes(val)) {
      return `:${val}`;
    }
    
    // C. Các trường hợp khác (gồm chuỗi chứa -, UUID, ngày tháng v.v.), đều thêm dấu ngoặc kép
    return `:"${val}"`;
  });
  $notify(1,3,s)
  // Đầu ra gỡ lỗi, bước này rất hữu ích, giúp bạn thấy nó đã trở thành dạng nào
  // console.log("Chuỗi đã chuẩn hóa:", s); 
  
  try {
    return s;//JSON.parse(s);
  } catch (e) {
    //console.error("Phân tích thất bại, có thể dấu câu vẫn còn lỗi:", e.message);
    return null; // hoặc trả về undefined
  }
}

//yaml string - {} type direct to json 
function YJSON(cnt) {
  cnt=cnt.replace(/proxies\:\n.*?\-/g,"{\"proxies\":[").replace(/}\s*\n.*?\-/g,"},").replace(/\n/g,"")+"]}"
  //console.log(cnt)
  cnt=superMagicParse(cnt)
  //console.log("repair"+"\n"+cnt)
  return cnt
}

function reorderYamlByNesting(yamlString, decodeUnicode = true) {
  // Nếu cần, giải mã Unicode trước
  if (decodeUnicode) {
    yamlString = decodeUnicodeEscapes(yamlString);
  }
  
  const lines = yamlString.split('\n');
  const result = [];
  let i = 0;
  // Thu thập khối trường (bao gồm tất cả các cấp con)
  function collectFieldBlock(startIdx, parentIndent) {
    const block = [lines[startIdx]];
    let idx = startIdx + 1;
    while (idx < lines.length) {
      const line = lines[idx];
      const indent = line.search(/\S/);
      const trimmed = line.trim();
      if (!trimmed) {
        idx++;
        continue;
      }
      if (indent <= parentIndent) {
        break;
      }
      block.push(line);
      idx++;
    }
    return { block, nextIdx: idx };
  }
  // Kiểm tra có cấp con hay không
  function hasChildren(block, parentIndent) {
    return block.slice(1).some(line => {
      const trimmed = line.trim();
      return trimmed && line.search(/\S/) > parentIndent;
    });
  }
  // Xử lý từng mục danh sách
  function processListItem(startIdx, listIndent) {
    const simpleFields = [];
    const nestedFields = [];
    const fieldIndent = listIndent + 2;
    let idx = startIdx;
    while (idx < lines.length) {
      const line = lines[idx];
      const indent = line.search(/\S/);
      const trimmed = line.trim();
      if (!trimmed) {
        idx++;
        continue;
      }
      if (indent <= listIndent) {
        break;
      }
      if (indent === fieldIndent && trimmed.includes(':')) {
        const { block, nextIdx } = collectFieldBlock(idx, fieldIndent);
        
        if (hasChildren(block, fieldIndent)) {
          nestedFields.push(...block);
        } else {
          simpleFields.push(block[0]);
        }
        
        idx = nextIdx;
      } else {
        idx++;
      }
    }
    return { simpleFields, nestedFields, endIdx: idx };
  }
  // Vòng lặp chính
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      const listIndent = line.search(/\S/);
      result.push(line);
      
      const { simpleFields, nestedFields, endIdx } = processListItem(i + 1, listIndent);
      result.push(...simpleFields, ...nestedFields);
      
      i = endIdx;
    } else {
      result.push(line);
      i++;
    }
  }
  return result.join('\n');
}
function decodeUnicodeEscapes(str) {
  return str
  .replace(/\\U([0-9A-Fa-f]{8})/g, (match, hex) => {
    return String.fromCodePoint(parseInt(hex, 16));
  })
  .replace(/\\u\{([0-9A-Fa-f]+)\}/g, (match, hex) => {
    return String.fromCodePoint(parseInt(hex, 16));
  })
  .replace(/\\u([0-9A-Fa-f]{4})/g, (match, hex) => {
    return String.fromCodePoint(parseInt(hex, 16));
  })
  .replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

// JSON hoàn chỉnh
function JCheck(cnt) {
  if (/^{/.test(cnt) &&/}$/.test(cnt)) {
    return 1
  } else {
    return 0
  }
}


// Clash parser
function Clash2QX(cnt) {
  const yaml = new YAML()
  //if (Pdbg==1) { $notify(" Before YAML Parse", "content", cnt)}
  // Nếu bản thân đã là JSON thì không cần phân tích
  aa = JCheck(cnt)==0 ? JSON.stringify(yaml.parse(reorderYamlByNesting(YAMLFix(cnt)))).replace(/yaml@bug𝟙/g,"[").replace(/冒号/gmi,":").replace(/yaml@bug𝟚/g,"*") : cnt
  for (var i=0;i<10;i++) {
    aa = aa.replace(new RegExp(patn[4][i], "gmi"),patn[0][i])
  }
  var bb = JSON.parse(aa).proxies
  if (Pdbg==1) { $notify("After YAML Parse", "content", JSON.stringify(bb))}
  //console.log(bb)
  var nl = bb.length
  var nodelist=[]
  var node=""
  for (i=0; i<nl; i++){
    try{
      node=bb[i]
      typecc = node.type
      if (typecc == "ss") {
        node = CSS2QX(node)
      } else if (typecc == "ssr"){
        node = CSSR2QX(node)
      } else if (typecc == "vmess"){
        node = CV2QX(node)
      } else if (typecc == "trojan"){
        node = CT2QX(node)
      } else if (typecc == "http"){
        node = CH2QX(node)
      } else if (typecc == "socks5"){
        node = CS52QX(node)
      } else if (typecc == "vless"){
        node = CVL2QX(node)
      } else if (typecc=="anytls" && version >913) { //anytls
        node = CTLS2QX(node)
      } else { // not support type
        PNS = PNS+1
        NSList.push(numToEmoji10(PNS)+bb[i])
        if (Pdbg==1) { // Thông báo nhắc nhở
        }
        typecc="NS"
      }
      node = Pudp0 != 0 ? XUDP(node,Pudp0) : node
      node = Ptfo0 != 0 ? XTFO(node,Ptfo0) : node
      if (typecc!="NS") {
      node=node.replace(/^([^,]*)\s+/g, (match, p1) => { // Vấn đề khoảng trắng ở một số node IPv6
        return p1.replace(/\s+/g, '');
      });
      nodelist.push(node)
    } 
    }catch (e) {
      $notify(`⚠️Node này phân tích lỗi, tạm thời đã bỏ qua xử lý`,`Có thể nhấn vào thông báo và gửi link phản hồi tới bot`,JSON.stringify(node),bug_link )
      $notify(`⚠️Nội dung lỗi như sau`,`Có thể sao chép nội dung lỗi gửi tới bot phản hồi`,JSON.stringify(node)+"\n\n"+e)
    }
  }
  return nodelist.join("\n")
}

/*
Ghi chú sửa lỗi Unicode tên Clash YAML ⟦2026-07-06 18:50:58 +08⟧
----------------------------------------------------------
Chỉ thay đổi resource-parser-r.js.
Sửa lỗi Unicode escape hai lớp trong tên server Clash YAML chưa được khôi phục:
  - "\\U0001F534"、"\U0001F534" đều sẽ được khôi phục thành emoji/ký tự tương ứng
  - Việc giải mã mới chỉ giới hạn ở name của node Clash -> tag QuanX, không mở rộng phạm vi xử lý trường toàn cục của YAML
----------------------------------------------------------
*/
function ClashNameFix(name) {
  var text = typeof name == "undefined" || name === null ? "" : String(name);
  function safeCodePoint(fallback, hex) {
    var code = parseInt(hex, 16);
    if (!isFinite(code) || code < 0 || code > 0x10FFFF) {
      return fallback;
    }
    return String.fromCodePoint(code);
  }
  return text
    .replace(/\\\\U([0-9A-Fa-f]{8})/g, function(match, hex) {
      return safeCodePoint(match, hex);
    })
    .replace(/\\U([0-9A-Fa-f]{8})/g, function(match, hex) {
      return safeCodePoint(match, hex);
    })
    .replace(/\\\\u\{([0-9A-Fa-f]+)\}/g, function(match, hex) {
      return safeCodePoint(match, hex);
    })
    .replace(/\\u\{([0-9A-Fa-f]+)\}/g, function(match, hex) {
      return safeCodePoint(match, hex);
    })
    .replace(/\\\\u([0-9A-Fa-f]{4})/g, function(match, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/\\u([0-9A-Fa-f]{4})/g, function(match, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });
}

//Clash ss type server
function CSS2QX(cnt) {
  tag = "tag="+ClashNameFix(cnt.name)
  ipt = cnt.server+":"+cnt.port
  pwd = "password=" + cnt.password
  mtd = "method="+ cnt.cipher
  udp = cnt.udp ? "udp-relay=true" : "udp-relay=false"
  uot = cnt["udp-over-tcp"] ?  "udp-over-tcp=true" : "udp-over-tcp=false"
  tfo = cnt.tfo ? "fast-open=true" : "fast-open=false"
  obfs = cnt["plugin-opts"] ? "obfs=" + cnt["plugin-opts"].mode : ""
  ohost = cnt["plugin-opts"] ? "obfs-host=" + cnt["plugin-opts"].host : ""
  ouri = ""
  cert = ""
  if (obfs.indexOf("websocket") != -1) {
      obfs = cnt["plugin-opts"].tls? "obfs=wss" : "obfs=ws"
      ohost = cnt["plugin-opts"].host? "obfs-host=" + cnt["plugin-opts"].host:""
      ouri = cnt["plugin-opts"].path? "obfs-uri=" + cnt["plugin-opts"].path: ""
    if (obfs == "obfs=wss") { // tls verification
      cert = TLSCertParam(Pcert0, "false")}
  }
  node = "shadowsocks="+[ipt, pwd, mtd, udp, uot, tfo, obfs, ohost, ouri, cert, tag].filter(Boolean).join(", ")
  return node
}

//Clash ssr type server
function CSSR2QX(cnt) {
  tag = "tag="+ClashNameFix(cnt.name)
  ipt = cnt.server+":"+cnt.port
  pwd = "password=" + cnt.password
  mtd = "method="+ cnt.cipher
  udp = cnt.udp ? "udp-relay=true" : "udp-relay=false"
  tfo = cnt.tfo ? "fast-open=true" : "fast-open=false"
  prot = "ssr-protocol=" + cnt.protocol
  ohost=""
  ppara=""
  if(cnt["protocolparam"]) {
    cnt["protocol-param"] = cnt["protocolparam"]
  }
  if (typeof(cnt["protocol-param"]) == "string") {
    ppara = "ssr-protocol-param=" + cnt["protocol-param"]
  } else if (typeof(cnt["protocol-param"]) == "object") {
    console.log(typeof(cnt["protocol-param"]))
    ppara = "ssr-protocol-param=" + JSON.stringify(cnt["protocol-param"]).replace(/{|}|\s|"/g,"")
  }
  obfs = "obfs=" + cnt.obfs
  if ( cnt["obfs-param"]) {
     ohost = "obfs-host=" + cnt["obfs-param"]
  } else if (cnt["obfsparam"]) {
     ohost = "obfs-host=" + cnt["obfsparam"]
  }
 
  node = "shadowsocks="+[ipt, pwd, mtd, udp, tfo, prot, ppara, obfs, ohost, tag].filter(Boolean).join(", ")
  //console.log(node)
  return node
}


//Clash vmess type server
function CV2QX(cnt) {
  tag = "tag="+ClashNameFix(cnt.name)
  ipt = cnt.server+":"+cnt.port
  pwd = "password=" + cnt.uuid
  mtd = "method="+ "aes-128-gcm" //cnt.cipher
  udp = cnt.udp ? "udp-relay=false" : "udp-relay=false" // Tạm thời chưa hỗ trợ
  tfo = cnt.tfo ? "fast-open=true" : "fast-open=false"
  obfs = ""
  if (cnt.network == "ws" && cnt.tls) {
    obfs = "obfs=wss"
  } else if (cnt.network == "ws"){
    obfs = "obfs=ws"
  } else if (cnt.network == "http"){
    obfs = "obfs=http"
  } else if (cnt.tls){
    obfs = "obfs=over-tls"
  }
  console.log(obfs)
  const phost = getValue(()=>cnt["ws-opts"]["headers"]["Host"]) 
  ohost = cnt["ws-headers"]? "obfs-host=" + cnt["ws-headers"]["Host"] : ""
  ohost = phost ? "obfs-host="+phost : ohost
  //ohost= cnt["ws-opts"]? "obfs-host=" + cnt["ws-opts"]["headers"]["Host"] : ohost
  ohost = cnt["servername"]? "obfs-host=" + cnt["servername"] : ohost
  console.log(ohost)
  ouri = cnt["ws-path"]? "obfs-uri="+cnt["ws-path"] : ""
  ouri = cnt["ws-opts"]? "obfs-uri="+cnt["ws-opts"]["path"] : ouri
  cert = cnt.tls ? TLSCertParam(Pcert0, cnt["skip-cert-verify"] ? "false" : "false") : ""
  caead = cnt["alterId"] && cnt["alterId"]!=0? "aead=false" : "" // Tùy chọn aead
  //caead = cnt["alterId"] == 0? "aead=true" : caead // Tùy chọn aead
  console.log(caead)
  //caead=""
  //$notify(cert)
  node = "vmess="+[ipt, pwd, mtd, udp, tfo, obfs, ohost, ouri, cert, caead, tag].filter(Boolean).join(", ")
  //console.log(node)
  return node
}


//Clash Trojan
function CT2QX(cnt) {
  tag = "tag="+ClashNameFix(cnt.name)
  ipt = cnt.server+":"+cnt.port
  pwd = "password=" + cnt.password
  otls = "over-tls=true"
  opath=""
  ohost=""
  cert = TLSCertParam(Pcert0, "false")
  tls13 = PTls13 == 1 ? "tls13=true" : "tls13=false"
  udp = cnt.udp ? "udp-relay=false" : "udp-relay=false"
  tfo = cnt.tfo ? "fast-open=true" : "fast-open=false"
  if (cnt.network=="ws") { // Loại wss
    otls = "obfs=wss"
    //$notify("trojan","WS",JSON.stringify(cnt))
    if (cnt["ws-opts"]){
    opath = cnt["ws-opts"]["path"]? "obfs-uri="+cnt["ws-opts"]["path"] : ""
    ohost = cnt["ws-opts"]["headers"]? "obfs-host="+cnt["ws-opts"]["headers"]["Host"] : ""
    }
    //$notify("trojan","WS",opath+":"+ohost)
  }
  node = "trojan="+[ipt, pwd, otls, opath, ohost, cert, tls13, udp, tfo, tag].filter(Boolean).join(", ")
  //console.log(node)
  return node
}

// Clash Anytls 2026-04-15

function CTLS2QX(cnt) {
  tag = "tag="+ClashNameFix(cnt.name)
  ipt = cnt.server+":"+cnt.port
  pwd = "password=" + cnt.password
  otls = "over-tls=true"
  opath=""
  ohost= "tls-host="+cnt.sni
  cert = TLSCertParam(Pcert0, "false")
  pudp = Pudp0 == -1 ? "udp-relay=false" : "udp-relay=true" // Mặc định bật
  node = "anytls="+[ipt, pwd, otls, ohost, pudp, cert, tag].filter(Boolean).join(", ")
  //console.log(node)
  return node
}

// Clash http
function CH2QX(cnt){
    tag = "tag="+ClashNameFix(cnt.name)
    ipt = cnt.server+":"+cnt.port
    uname = cnt.username ? "username=" + cnt.username : ""
    pwd = cnt.password && typeof(cnt.password) == "string" ? "password=" + cnt.password : ""
    tls = cnt.tls ? "over-tls=true" : ""
    cert = cnt.tls ? TLSCertParam(Pcert0, "false") : ""
    node = "http="+[ipt, uname, pwd, tls, cert, tag].filter(Boolean).join(", ")
    //console.log(node)
    return node
}

// Clash socks5
function CS52QX(cnt){
    tag = "tag="+ClashNameFix(cnt.name)
    ipt = cnt.server+":"+cnt.port
    uname = cnt.username ? "username=" + cnt.username : ""
    pwd = cnt.password && typeof(cnt.password) == "string" ? "password=" + cnt.password : ""
    tls = cnt.tls ? "over-tls=true" : ""
    cert = cnt.tls ? TLSCertParam(Pcert0, "false") : ""
    node = "socks5="+[ipt, uname, pwd, tls, cert, tag].filter(Boolean).join(", ")
    //console.log(node)
    return node
}

// clash vless type ,2026-01-07
function CVL2QX(cnt){
  tag = "tag="+ClashNameFix(cnt.name).replace(/(\"|\')/gi,"")
  ipt = cnt.server+":"+cnt.port
  pwd = "password=" + cnt.uuid
  mtd = "method=none" //cnt.cipher
  udp = cnt.udp ? "udp-relay=true" : "udp-relay=false"
  tfo = cnt.tfo ? "fast-open=true" : "fast-open=false"
  obfs = ""
  if (cnt.network == "ws" && cnt.tls) {
    obfs = "obfs=wss"
  } else if (cnt.network == "ws"){
    obfs = "obfs=ws"
  } else if (cnt.tls){
    obfs = "obfs=over-tls"
  }
  vfl=cnt.flow? "vless-flow=xtls-rprx-vision":""
  const ppbk=getValue(()=>cnt["reality-opts"]["public-key"]) 
  const psid=getValue(()=>cnt["reality-opts"]["short-id"])
  pbk=ppbk? "reality-base64-pubkey="+ppbk : ""
  sid=typeof(psid)=='string'? "reality-hex-shortid="+psid : ""
//  console.log(obfs)
  const phost = getValue(()=>cnt["ws-opts"]["headers"]["Host"]) 
  ohost = cnt["ws-headers"]? "obfs-host=" + cnt["ws-headers"]["Host"] : ""
  ohost = phost ? "obfs-host="+phost : ohost
  //ohost= cnt["ws-opts"]? "obfs-host=" + cnt["ws-opts"]["headers"]["Host"] : ohost
  ohost = cnt["servername"]? "obfs-host=" + cnt["servername"] : ohost
  ohost=ohost.toLowerCase()

  const ppath = getValue(()=>cnt["ws-opts"]["path"]) 
  puri = ppath ? "obfs-uri="+ppath : ""

  cert = cnt.tls ? TLSCertParam(Pcert0, "false") : ""
  //$notify(cert)
  const pspt = getValue(()=>cnt["ws-opts"]["v2ray-http-upgrade"])
  if (pspt==true) {
    PNS = PNS +1
    NSList.push(numToEmoji10(PNS)+cnt)
    node=""
  } else {
    node = "vless="+[ipt, pwd, mtd, udp, tfo, obfs, ohost, puri, vfl, pbk, sid, cert, tag].filter(Boolean).join(", ")
  }
  //console.log(node)
  return node
}

// Tham số UDP/TFO (ép chuyển đổi kiểu surge/quanx)
function XUDP(cnt,pudp) {
  var udp = pudp != -1 && /^(shadowsocks|trojan|vmess|vless|anytls)/.test(cnt.trim()) ? "udp-relay=true, " : "udp-relay=false, "
  if(cnt.indexOf("udp-relay") != -1){
    var cnt0 = cnt.replace(RegExp("udp\-relay.*?\,", "gmi"), udp)
  }else{
    var cnt0 = cnt.replace(new RegExp("tag.*?\=", "gmi"), udp+"tag=")
  }
  //console.log("UDP-Handle","",cnt0)
  return cnt0
}

function XTFO(cnt,ptfo) {
    var tfo = ptfo == 1? "fast-open=true, " : "fast-open=false, "
    if(cnt.indexOf("fast-open") != -1){
        var cnt0 = cnt.replace(RegExp("fast\-open.*?\,", "gmi"), tfo)
    }else{
        var cnt0 = cnt.replace(RegExp("tag.*?\=", "gmi"), tfo+"tag=")
    }
    return cnt0
}


// Bật udp-over-tcp=true
function UOT(cnt) {
  cnts=cnt.replace(/\s*/g,"")
  if(/^shadowsocks=/.test(cnts)) {
    cnt= cnts.indexOf("udp-over-tcp")!=-1? cnt.replace(/udp-over-tcp\s*\=\s*false/g,"udp-over-tcp=true") : cnt+", udp-over-tcp=true"
    
  }
  return cnt
}

// Một công cụ encode/decode base64 khá hoàn hảo
/*
 *  base64.js: https://github.com/dankogai/js-base64#readme
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
// Kết thúc base64
function Base64Code() {
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function (bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function (c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                    + fromCharCode(0x80 | (cc & 0x3f)))
                    : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                        + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                        + fromCharCode(0x80 | (cc & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                + fromCharCode(0x80 | (cc & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function (u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function (ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [
                b64chars.charAt(ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
        return chars.join('');
    };
    var btoa = function (b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    // var _encode = function(u) {
    //  var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
    //  return isUint8Array ? u.toString('base64')
    //    : btoa(utob(String(u)));
    // }
    this.encode = function (u) {
        var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
        return isUint8Array ? u.toString('base64')
            : btoa(utob(String(u)));
    }
    var uriencode = function (u, urisafe) {
        return !urisafe
            ? _encode(u)
            : _encode(String(u)).replace(/[+\/]/g, function (m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function (u) { return uriencode(u, true) };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function (cccc) {
        switch (cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                    | ((0x3f & cccc.charCodeAt(1)) << 12)
                    | ((0x3f & cccc.charCodeAt(2)) << 6)
                    | (0x3f & cccc.charCodeAt(3)),
                    offset = cp - 0x10000;
                return (fromCharCode((offset >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
            case 3:
                return fromCharCode(
                    ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    | (0x3f & cccc.charCodeAt(2))
                );
            default:
                return fromCharCode(
                    ((0x1f & cccc.charCodeAt(0)) << 6)
                    | (0x3f & cccc.charCodeAt(1))
                );
        }
    };
    var btou = function (b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function (cccc) {
        var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
                | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
            chars = [
                fromCharCode(n >>> 16),
                fromCharCode((n >>> 8) & 0xff),
                fromCharCode(n & 0xff)
            ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = function (a) {
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function (a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    // var _decode = buffer ?
    //  buffer.from && Uint8Array && buffer.from !== Uint8Array.from
    //  ? function(a) {
    //    return (a.constructor === buffer.constructor
    //        ? a : buffer.from(a, 'base64')).toString();
    //  }
    //  : function(a) {
    //    return (a.constructor === buffer.constructor
    //        ? a : new buffer(a, 'base64')).toString();
    //  }
    //  : function(a) { return btou(_atob(a)) };
    var _decode = function (u) {
        return btou(_atob(u))
    }
    this.decode = function (a) {
        return _decode(
            String(a).replace(/[-_]/g, function (m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        ).replace(/&gt;/g, ">").replace(/&lt;/g, "<");
    };
}


/*
YAML parser for Javascript
Author: Diogo Costa

This program is released under the MIT License as follows:

Copyright (c) 2011 Diogo Costa (costa.h4evr@gmail.com)

*/

/*
Ghi chú sửa lỗi YAML parser ⟦2026-06-30 18:29:46 HKT⟧
----------------------------------------------------------
Chỉ thay đổi thân hàm YAML(), file gốc resource-parser.js không bị sửa.
Các điểm sửa chính:
1. Loại bỏ chuyển đổi tự động Date.parse, tránh các trường thông thường như http/1.1, HK:01, 2026-06-30 bị chuyển nhầm thành Date.
2. Hỗ trợ key một ký tự, quoted key, cách viết key:value không có khoảng trắng, giá trị rỗng, mảng cấp cao nhất.
3. Viết lại xử lý comment, chỉ coi # ở đầu dòng hoặc sau khoảng trắng là comment, giữ lại các giá trị như pa#ss, fragment URL, v.v.
4. Cải thiện phân tích flow map/flow array, tách dấu phẩy theo cấp độ ngoặc và dấu ngoặc kép, hỗ trợ dấu phẩy và dấu hai chấm trong dấu ngoặc kép.
5. Thêm hỗ trợ cơ bản anchor/alias/merge(<<), và khi thụt lề bất thường thì ghi lại errors, tránh crash undefined.children.
----------------------------------------------------------
*/
function YAML() {
        var self = this;
        var errors = [];
        var reference_blocks = {};
        var processing_time = 0;
        var lines = [];
        var cursor = 0;

        this.errors = errors;
        this.processing_time = processing_time;

        function clone(obj) {
                if (obj === null || typeof obj !== "object") {
                        return obj;
                }
                try {
                        return JSON.parse(JSON.stringify(obj));
                } catch (err) {
                        return obj;
                }
        }

        function isObject(obj) {
                return obj !== null && typeof obj === "object" && !Array.isArray(obj);
        }

        function mergeInto(target, source) {
                if (!isObject(target) || !isObject(source)) {
                        return target;
                }
                for (var key in source) {
                        if (typeof target[key] == "undefined") {
                                target[key] = clone(source[key]);
                        }
                }
                return target;
        }

        function countIndent(line) {
                var match = String(line).match(/^\s*/);
                return match ? match[0].length : 0;
        }

        function trimRight(str) {
                return String(str).replace(/\s+$/, "");
        }

        function stripComments(line) {
                var quote = "";
                var escaped = false;
                var result = "";
                for (var i = 0; i < line.length; i++) {
                        var ch = line[i];
                        if (quote) {
                                result += ch;
                                if (quote == "\"" && ch == "\\" && !escaped) {
                                        escaped = true;
                                        continue;
                                }
                                if (quote == "'" && ch == "'" && line[i + 1] == "'") {
                                        result += line[++i];
                                        continue;
                                }
                                if (ch == quote && !escaped) {
                                        quote = "";
                                }
                                escaped = false;
                                continue;
                        }
                        if (ch == "\"" || ch == "'") {
                                quote = ch;
                                result += ch;
                        } else if (ch == "#" && (i == 0 || /\s/.test(line[i - 1]))) {
                                return trimRight(result);
                        } else {
                                result += ch;
                        }
                }
                return trimRight(result);
        }

        function preProcess(src) {
                return String(src)
                        .replace(/\r/g, "")
                        .split("\n")
                        .map(stripComments)
                        .filter(function(line) {
                                var trimmed = line.trim();
                                return trimmed != "" && trimmed != "---" && trimmed != "...";
                        });
        }

        function splitTopLevel(str, delimiter) {
                var result = [];
                var buf = "";
                var quote = "";
                var escaped = false;
                var depth = 0;
                for (var i = 0; i < str.length; i++) {
                        var ch = str[i];
                        if (quote) {
                                buf += ch;
                                if (quote == "\"" && ch == "\\" && !escaped) {
                                        escaped = true;
                                        continue;
                                }
                                if (quote == "'" && ch == "'" && str[i + 1] == "'") {
                                        buf += str[++i];
                                        continue;
                                }
                                if (ch == quote && !escaped) {
                                        quote = "";
                                }
                                escaped = false;
                                continue;
                        }
                        if (ch == "\"" || ch == "'") {
                                quote = ch;
                                buf += ch;
                        } else if (ch == "[" || ch == "{") {
                                depth++;
                                buf += ch;
                        } else if (ch == "]" || ch == "}") {
                                depth--;
                                buf += ch;
                        } else if (ch == delimiter && depth == 0) {
                                result.push(buf.trim());
                                buf = "";
                        } else {
                                buf += ch;
                        }
                }
                if (buf.trim() != "" || str.trim() == "") {
                        result.push(buf.trim());
                }
                return result;
        }

        function findTopLevelColon(str) {
                var quote = "";
                var escaped = false;
                var depth = 0;
                for (var i = 0; i < str.length; i++) {
                        var ch = str[i];
                        if (quote) {
                                if (quote == "\"" && ch == "\\" && !escaped) {
                                        escaped = true;
                                        continue;
                                }
                                if (quote == "'" && ch == "'" && str[i + 1] == "'") {
                                        i++;
                                        continue;
                                }
                                if (ch == quote && !escaped) {
                                        quote = "";
                                }
                                escaped = false;
                                continue;
                        }
                        if (ch == "\"" || ch == "'") {
                                quote = ch;
                        } else if (ch == "[" || ch == "{") {
                                depth++;
                        } else if (ch == "]" || ch == "}") {
                                depth--;
                        } else if (ch == ":" && depth == 0) {
                                return i;
                        }
                }
                return -1;
        }

        function unescapeDoubleQuoted(str) {
                return str
                        .replace(/\\u([0-9A-Fa-f]{4})/g, function(match, hex) {
                                return String.fromCharCode(parseInt(hex, 16));
                        })
                        .replace(/\\x([0-9A-Fa-f]{2})/g, function(match, hex) {
                                return String.fromCharCode(parseInt(hex, 16));
                        })
                        .replace(/\\(["\\\/bfnrt])/g, function(match, ch) {
                                return {
                                        "\"": "\"",
                                        "\\": "\\",
                                        "/": "/",
                                        "b": "\b",
                                        "f": "\f",
                                        "n": "\n",
                                        "r": "\r",
                                        "t": "\t"
                                }[ch];
                        });
        }

        function parseKey(raw) {
                var key = String(raw).trim();
                if (/^".*"$/.test(key)) {
                        return unescapeDoubleQuoted(key.slice(1, -1));
                }
                if (/^'.*'$/.test(key)) {
                        return key.slice(1, -1).replace(/''/g, "'");
                }
                return key;
        }

        function parseKeyValue(str) {
                var idx = findTopLevelColon(str);
                if (idx <= 0) {
                        return null;
                }
                return {
                        key: parseKey(str.slice(0, idx)),
                        value: str.slice(idx + 1).trim()
                };
        }

        function parseAnchor(value) {
                var match = String(value).match(/^&([^\s]+)\s*(.*)$/);
                if (!match) {
                        return null;
                }
                return {
                        name: match[1],
                        value: match[2].trim()
                };
        }

        function processAlias(value) {
                var name = String(value).slice(1).trim();
                if (typeof reference_blocks[name] == "undefined") {
                        errors.push("Reference '" + name + "' not found");
                        return {};
                }
                return clone(reference_blocks[name]);
        }

        function parseFlowArray(value) {
                var inner = value.slice(1, -1).trim();
                if (inner == "") {
                        return [];
                }
                return splitTopLevel(inner, ",").map(processValue);
        }

        function parseFlowMap(value) {
                var inner = value.slice(1, -1).trim();
                var obj = {};
                if (inner == "") {
                        return obj;
                }
                var parts = splitTopLevel(inner, ",");
                for (var i = 0; i < parts.length; i++) {
                        var item = parseKeyValue(parts[i]);
                        if (!item) {
                                continue;
                        }
                        var parsed = processValue(item.value);
                        if (item.key == "<<") {
                                if (Array.isArray(parsed)) {
                                        for (var j = 0; j < parsed.length; j++) {
                                                mergeInto(obj, parsed[j]);
                                        }
                                } else {
                                        mergeInto(obj, parsed);
                                }
                        } else {
                                obj[item.key] = parsed;
                        }
                }
                return obj;
        }

        function processValue(val) {
                val = typeof val == "undefined" || val === null ? "" : String(val).trim();
                if (val == "") {
                        return null;
                }
                if (val[0] == "*") {
                        return processAlias(val);
                }
                if (/^".*"$/.test(val)) {
                        return unescapeDoubleQuoted(val.slice(1, -1));
                }
                if (/^'.*'$/.test(val)) {
                        return val.slice(1, -1).replace(/''/g, "'");
                }
                if (/^\[[\s\S]*\]$/.test(val)) {
                        return parseFlowArray(val);
                }
                if (/^\{[\s\S]*\}$/.test(val)) {
                        return parseFlowMap(val);
                }
                if (val == "true") {
                        return true;
                }
                if (val == "false") {
                        return false;
                }
                if (val == "null" || val == "~") {
                        return null;
                }
                if (val == ".NaN") {
                        return Number.NaN;
                }
                if (val == ".inf" || val == "+.inf") {
                        return Number.POSITIVE_INFINITY;
                }
                if (val == "-.inf") {
                        return Number.NEGATIVE_INFINITY;
                }
                if (/^[+-]?\d+$/.test(val)) {
                        return parseInt(val, 10);
                }
                if (/^[+-]?(?:\d+\.\d*|\d*\.\d+)(?:e[+-]?\d+)?$/i.test(val)) {
                        return parseFloat(val);
                }
                return val;
        }

        function parseTextBlock(indent, folded) {
                var collected = [];
                while (cursor < lines.length) {
                        var line = lines[cursor];
                        var lineIndent = countIndent(line);
                        if (lineIndent < indent) {
                                break;
                        }
                        collected.push(line.slice(Math.min(indent, line.length)));
                        cursor++;
                }
                return folded ? collected.join(" ").replace(/\s+/g, " ").trim() : collected.join("\n");
        }

        function parseNestedValue(parentIndent, value) {
                if (value == "|" || value == ">") {
                        if (cursor < lines.length && countIndent(lines[cursor]) > parentIndent) {
                                return parseTextBlock(countIndent(lines[cursor]), value == ">");
                        }
                        return "";
                }
                if (value == "") {
                        if (cursor < lines.length && countIndent(lines[cursor]) > parentIndent) {
                                return parseBlock(countIndent(lines[cursor]));
                        }
                        return null;
                }
                return processValue(value);
        }

        function parseMap(indent) {
                var obj = {};
                while (cursor < lines.length) {
                        var line = lines[cursor];
                        var lineIndent = countIndent(line);
                        var trimmed = line.trim();
                        if (lineIndent < indent) {
                                break;
                        }
                        if (lineIndent > indent) {
                                errors.push("Invalid indentation at line " + (cursor + 1) + ": " + line);
                                cursor++;
                                continue;
                        }
                        if (/^-\s*/.test(trimmed)) {
                                break;
                        }
                        var pair = parseKeyValue(trimmed);
                        if (!pair) {
                                errors.push("Invalid map item at line " + (cursor + 1) + ": " + line);
                                cursor++;
                                continue;
                        }
                        cursor++;
                        var anchor = parseAnchor(pair.value);
                        var anchorName = anchor ? anchor.name : "";
                        var value = anchor ? anchor.value : pair.value;
                        var parsed = parseNestedValue(lineIndent, value);
                        if (anchorName) {
                                reference_blocks[anchorName] = clone(parsed);
                        }
                        if (pair.key == "<<") {
                                if (Array.isArray(parsed)) {
                                        for (var i = 0; i < parsed.length; i++) {
                                                mergeInto(obj, parsed[i]);
                                        }
                                } else {
                                        mergeInto(obj, parsed);
                                }
                        } else {
                                obj[pair.key] = parsed;
                        }
                }
                return obj;
        }

        function parseSeq(indent) {
                var arr = [];
                while (cursor < lines.length) {
                        var line = lines[cursor];
                        var lineIndent = countIndent(line);
                        var trimmed = line.trim();
                        if (lineIndent < indent) {
                                break;
                        }
                        if (lineIndent > indent) {
                                errors.push("Invalid indentation at line " + (cursor + 1) + ": " + line);
                                cursor++;
                                continue;
                        }
                        if (!/^-/.test(trimmed)) {
                                break;
                        }
                        var itemText = trimmed.replace(/^-\s*/, "");
                        cursor++;
                        var anchor = parseAnchor(itemText);
                        var anchorName = anchor ? anchor.name : "";
                        itemText = anchor ? anchor.value : itemText;
                        var item;
                        var pair = parseKeyValue(itemText);
                        if (itemText == "") {
                                item = cursor < lines.length && countIndent(lines[cursor]) > lineIndent ? parseBlock(countIndent(lines[cursor])) : null;
                        } else if (pair && !/^[a-z][a-z0-9+.-]*:\/\//i.test(itemText)) {
                                item = {};
                                item[pair.key] = parseNestedValue(lineIndent, pair.value);
                                if (cursor < lines.length && countIndent(lines[cursor]) > lineIndent) {
                                        var next = parseBlock(countIndent(lines[cursor]));
                                        if (isObject(next)) {
                                                mergeInto(next, item);
                                                item = next;
                                        }
                                }
                        } else {
                                item = processValue(itemText);
                                if (cursor < lines.length && countIndent(lines[cursor]) > lineIndent && item === null) {
                                        item = parseBlock(countIndent(lines[cursor]));
                                }
                        }
                        if (anchorName) {
                                reference_blocks[anchorName] = clone(item);
                        }
                        arr.push(item);
                }
                return arr;
        }

        function parseBlock(indent) {
                if (cursor >= lines.length) {
                        return {};
                }
                var lineIndent = countIndent(lines[cursor]);
                if (lineIndent < indent) {
                        return {};
                }
                if (/^-\s*/.test(lines[cursor].trim())) {
                        return parseSeq(lineIndent);
                }
                return parseMap(lineIndent);
        }

        this.parse = function eval0(str) {
                errors = [];
                reference_blocks = {};
                processing_time = (new Date()).getTime();
                lines = preProcess(str);
                cursor = 0;
                var result = lines.length == 0 ? {} : parseBlock(countIndent(lines[0]));
                processing_time = (new Date()).getTime() - processing_time;
                self.errors = errors;
                self.processing_time = processing_time;
                return result;
        }
}


/***********************************************************************************************/
function Tools() {
    const filter = (src, ...regex) => {
        const initial = [...Array(src.length).keys()].map(() => false);
        return regex.reduce((a, expr) => OR(a, src.map(item => expr.test(item))), initial)
    }

    const rename = {
        replace: (src, old, now) => {
            return src.map(item => item.replace(old, now));
        },

        delete: (src, ...args) => {
            return src.map(item => args.reduce((now, expr) => now.replace(expr, ''), item));
        },

        trim: (src) => {
            return src.map(item => item.trim().replace(/[^\S\r\n]{2,}/g, ' '));
        }
    }

    const getNodeInfo = servers => {
        const nodes = {
            names: servers.map(s => s.split("tag=")[1]),
            types: servers.map(s => {
                const type = s.match(/^(vmess|trojan|shadowsocks|http)=/);
                return type ? type[1] : 'unknown';
            })
        };
        return nodes;
    }


    return {
        filter, rename, getNodeInfo
    }
}

function AND(...args) {
    return args.reduce((a, b) => a.map((c, i) => b[i] && c));
}

function OR(...args) {
    return args.reduce((a, b) => a.map((c, i) => b[i] || c))
}

function NOT(array) {
    return array.map(c => !c);
}
