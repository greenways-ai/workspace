import{_ as he}from"./preload-helper.BlTxHScW.js";const R={"(":")","[":"]","{":"}"},ee=new Set(Object.values(R));function C(e,n,a,t,l="end"){e.setRangeText(t,n,a,l),e.dispatchEvent(new Event("input",{bubbles:!0}))}function ie(e,n){return e.lastIndexOf(`
`,n-1)+1}function Le(e,n){return e.slice(ie(e,n),n).match(/^\s*/)?.[0]??""}function Te(e,n){const{value:a,selectionStart:t,selectionEnd:l}=e;if(Object.hasOwn(R,n)){const c=R[n];return t!==l?(C(e,t,l,`${n}${a.slice(t,l)}${c}`,"select"),e.setSelectionRange(t+1,l+1)):(C(e,t,l,`${n}${c}`),e.setSelectionRange(t+1,t+1)),!0}if(ee.has(n))return t===l&&a[t]===n?e.setSelectionRange(t+1,t+1):C(e,t,l,n),!0;if(n==="Backspace"&&t===l&&t>0&&R[a[t-1]]===a[t])return C(e,t-1,t+1,""),!0;if(n==="Enter"){const i=a.slice(0,t).trimEnd().at(-1),r=Le(a,t)+(Object.hasOwn(R,i)?"  ":"");return C(e,t,l,`
${r}`),!0}return!1}function Ce(e,n=!1){const{value:a,selectionStart:t,selectionEnd:l}=e;if(!n){C(e,t,l,"  ");return}const c=ie(a,t),i=a.indexOf(`
`,l)===-1?a.length:a.indexOf(`
`,l),u=a.slice(c,i).replace(/^ {1,2}/gm,"");C(e,c,i,u,"select"),e.setSelectionRange(c,c+u.length)}function Re(e,n){const a=[];let t=!1,l=!1,c=!1;for(let i=0;i<n;i+=1){const r=e[i];if(l){r===`
`&&(l=!1);continue}if(t){!c&&r==='"'&&(t=!1),c=!c&&r==="\\";continue}if(r===";"){l=!0;continue}if(r==='"'){t=!0,c=!1;continue}Object.hasOwn(R,r)?a.push(r):ee.has(r)&&R[a.at(-1)]===r&&a.pop()}return a.length}function Oe(e){const{value:n,selectionStart:a,selectionEnd:t}=e,l=ie(n,a),c=n.indexOf(`
`,l)===-1?n.length:n.indexOf(`
`,l),i=n.slice(l,c),r=i.trimStart();let u=Re(n,l);r&&ee.has(r[0])&&(u=Math.max(0,u-1));const d=" ".repeat(u*2),o=i.slice(0,i.length-r.length);if(o===d)return!1;C(e,l,l+o.length,d);const h=d.length-o.length,b=f=>f<=l+o.length?l+d.length:f+h;return e.setSelectionRange(b(a),b(t)),!0}function we(e){const n=[],a=[];let t=!1,l=!1,c=!1;for(let i=0;i<e.length;i+=1){const r=e[i];if(l){r===`
`&&(l=!1);continue}if(t){!c&&r==='"'&&(t=!1),c=!c&&r==="\\";continue}if(r===";"){l=!0;continue}if(r==='"'){t=!0,c=!1;continue}if(Object.hasOwn(R,r)&&a.push({opener:r,start:i}),ee.has(r)&&a.length&&R[a.at(-1).opener]===r){const u=a.pop();n.push({start:u.start,end:i+1})}}return n}function ye(e,n,a=e.length){let t=n;for(;t<a;){if(/\s/.test(e[t])){t+=1;continue}if(e[t]===";"){const i=e.indexOf(`
`,t);t=i===-1?a:i+1;continue}break}if(t>=a)return null;const l=e[t];if(Object.hasOwn(R,l)){const i=R[l];let r=0,u=!1,d=!1;for(let o=t;o<a;o+=1){const h=e[o];if(u){!d&&h==='"'&&(u=!1),d=!d&&h==="\\";continue}if(h==='"'){u=!0,d=!1;continue}if(h===l&&(r+=1),h===i&&--r===0)return{start:t,end:o+1}}return null}if(l==='"'){let i=!1;for(let r=t+1;r<a;r+=1){if(!i&&e[r]==='"')return{start:t,end:r+1};i=!i&&e[r]==="\\"}return null}let c=t;for(;c<a&&!/\s/.test(e[c])&&!"()[]{}".includes(e[c]);)c+=1;return c>t?{start:t,end:c}:null}function re(e,n){return we(e).filter(a=>a.start<n&&n<a.end).sort((a,t)=>a.end-a.start-(t.end-t.start))[0]??null}function Ie(e){const{value:n,selectionStart:a,selectionEnd:t}=e,l=re(n,a);if(!l)return!1;const c=ye(n,l.end);return c?(C(e,l.end-1,c.end,`${n.slice(l.end,c.end)}${n[l.end-1]}`),e.setSelectionRange(a,t),!0):!1}function Pe(e){const{value:n,selectionStart:a,selectionEnd:t}=e,l=re(n,a);if(!l)return!1;const c=[];for(let d=l.start+1;d<l.end-1;){const o=ye(n,d,l.end-1);if(!o)break;c.push(o),d=o.end}const i=c.at(-1);if(!i)return!1;const r=n.slice(l.start+1,i.start).match(/\s*$/)?.[0]??"",u=i.start-r.length;return C(e,u,l.end,`${n[l.end-1]}${r}${n.slice(i.start,l.end-1)}`),e.setSelectionRange(a,t),!0}function je(e){const{value:n,selectionStart:a}=e,l=re(n,a)?.end-1;return l==null||a>=l?!1:(C(e,a,l,""),!0)}function ge(e,n){const a=we(e);if(/\s/.test(e[n]??"")){const d=a.filter(o=>o.end<=n).sort((o,h)=>h.end-o.end||o.end-o.start-(h.end-h.start))[0];if(d)return{...d,source:e.slice(d.start,d.end)}}const t=a.filter(d=>d.start<=n&&n<=d.end).sort((d,o)=>d.end-d.start-(o.end-o.start));if(t.length){const d=t[0];return{...d,source:e.slice(d.start,d.end)}}const l=a.filter(d=>d.end<=n).sort((d,o)=>o.end-d.end)[0];if(l)return{...l,source:e.slice(l.start,l.end)};const c=(e.slice(0,n).search(/[^\s()[\]{}]/)===-1,n),i=e.lastIndexOf(`
`,c-1)+1,r=e.slice(i,e.indexOf(`
`,c)===-1?e.length:e.indexOf(`
`,c)),u=/[^\s()[\]{}]+/g;for(const d of r.matchAll(u)){const o=i+d.index,h=o+d[0].length;if(o<=n&&n<=h)return{start:o,end:h,source:d[0]}}return null}function V(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function Me(e,{evalRange:n=null}={}){let a="",t=0,l=!1,c=!1,i=!1;const r=u=>n&&u>=n.start&&u<n.end?" eval-target":"";for(let u=0;u<e.length;u+=1){const d=e[u];if(c){a+=`<span class="comment${r(u)}">${V(d)}</span>`,d===`
`&&(c=!1);continue}if(l){a+=`<span class="string${r(u)}">${V(d)}</span>`,!i&&d==='"'&&(l=!1),i=!i&&d==="\\";continue}if(d===";"){c=!0,a+=`<span class="comment${r(u)}">;</span>`;continue}if(d==='"'){l=!0,i=!1,a+=`<span class="string${r(u)}">"</span>`;continue}if("([{".includes(d)){a+=`<span class="paren-${t%6}${r(u)}">${d}</span>`,t+=1;continue}if(")]}".includes(d)){t-=1,a+=`<span class="${t<0?"unmatched":`paren-${t%6}`}${r(u)}">${d}</span>`;continue}if(d===":"){const o=e.slice(u).match(/^:[A-Za-z*+!?._/-]+/);if(o){a+=`<span class="keyword${r(u)}">${V(o[0])}</span>`,u+=o[0].length-1;continue}}a+=r(u)?`<span class="eval-target">${V(d)}</span>`:V(d)}return a}function Ke(e,n){return{"studio.store":`${n}/rust/studio/hal/store.hal`,"studio.fs":`${n}/rust/studio/hal/fs.hal`,"studio.node":`${e}/studio/hal/node.hal`,"studio.draw":`${e}/studio/hal/draw.hal`,"std.lib.substrate.frame":`${e}/std/lib/substrate/frame.hal`}}function De(e,n=fetch){if(typeof e!="function")return n;let a=0,t=0;return async(l,c)=>{const i=await n(l,c),r=Number(i.headers.get("content-length"))||0;if(t+=r,!i.body)return i;const u=i.body.getReader(),d=new ReadableStream({async pull(o){const{done:h,value:b}=await u.read();if(h){o.close();return}a+=b.byteLength;const f=t?Math.min(99,Math.round(a/t*100)):0;e("Loading Hara kernel",f),o.enqueue(b)}});return new Response(d,{status:i.status,statusText:i.statusText,headers:i.headers})}}async function He({createKernel:e,kernelModuleUrl:n}){if(e)return e;const a=await import(n);if(typeof a.createDocsKernel!="function")throw new Error(`kernel module ${n} does not export createDocsKernel`);return a.createDocsKernel}const G=new Map;function qe({runtimeBase:e="/runtime",docsAssetsBase:n="/docs-assets",kernelModuleUrl:a=null,createKernel:t=null,manifestUrl:l=null,workerUrl:c=null,resources:i=null,fetchAsset:r=null,onProgress:u=null}={}){const d={runtimeBase:e,docsAssetsBase:n,kernelModuleUrl:a??`${n}/javascripts/kernel.js`,manifestUrl:l??`${e}/kernel-manifest.json`,workerUrl:c??`${e}/hta-worker.js`,resources:i??Ke(e,n)},o=t?null:JSON.stringify(d);if(o&&G.has(o))return G.get(o);const h=De(u,r??fetch),b=Promise.resolve().then(()=>h(d.manifestUrl)).then(async f=>{if(!f.ok)throw new Error(`kernel manifest: ${f.status}`);const x=await f.json();return(await He({createKernel:t,kernelModuleUrl:d.kernelModuleUrl}))({wasmUrl:x.variants.core.url,workerUrl:d.workerUrl,manifest:x,resources:d.resources,fetchAsset:h})});return o&&(G.set(o,b),b.catch(()=>{G.get(o)===b&&G.delete(o)})),b}const Ne=`(ns+)

(require [studio.draw :as draw])

;; Pong
;; Full-screen autonomous Pong. Both horizontal paddles track the ball while
;; the ball bounces from the viewport edges and the paddle faces.
;; TRY: change paddle-speed to make the rally more or less forgiving.
;; TRY: change the initial vx/vy values to alter the rhythm.

(def game-width 1000)
(def game-height 600)
(def ball-radius 12)
(def paddle-width 180)
(def paddle-height 16)
(def paddle-speed 8)
(def top-y 48)
(def bottom-y (- game-height 64))

(defn smaller [a b] (if (< a b) a b))
(defn larger [a b] (if (> a b) a b))
(defn absolute [value] (if (neg? value) (- 0 value) value))
(defn clamp [value low high]
  (if (< value low) low (if (> value high) high value)))

(defn initial-state []
  {:top-x (/ (- game-width paddle-width) 2)
   :bottom-x (/ (- game-width paddle-width) 2)
   :ball {:x (/ game-width 2)
          :y (/ game-height 2)
          :vx 6
          :vy 5}})

(defn track-paddle [position target speed]
  (let [delta (- target (+ position (/ paddle-width 2)))]
    (let [step (clamp delta (- 0 speed) speed)]
      (clamp (+ position step) 0 (- game-width paddle-width)))))

(defn update-paddles [state]
  (let [ball-x (get (get state :ball) :x)]
    (let [top-x (track-paddle (get state :top-x) ball-x paddle-speed)
          bottom-x (track-paddle (get state :bottom-x) ball-x paddle-speed)]
      (assoc (assoc state :top-x top-x) :bottom-x bottom-x))))

(defn advance-ball [ball]
  (assoc
    (assoc ball :x (+ (get ball :x) (get ball :vx)))
    :y
    (+ (get ball :y) (get ball :vy))))

(defn bounce-side-walls [ball]
  (let [x (get ball :x)
        vx (get ball :vx)]
    (if (<= x ball-radius)
      (assoc (assoc ball :x ball-radius) :vx (absolute vx))
      (if (>= x (- game-width ball-radius))
        (assoc
          (assoc ball :x (- game-width ball-radius))
          :vx
          (- 0 (absolute vx)))
        ball))))

(defn over-paddle [ball paddle-x]
  (let [x (get ball :x)]
    (if (>= x (- paddle-x ball-radius))
      (<= x (+ paddle-x paddle-width ball-radius))
      false)))

(defn bounce-paddles [ball top-x bottom-x]
  (let [y (get ball :y)
        vy (get ball :vy)]
    (if (if (< vy 0)
          (if (<= y (+ top-y paddle-height ball-radius))
            (over-paddle ball top-x)
            false)
          false)
      (assoc
        (assoc ball :y (+ top-y paddle-height ball-radius))
        :vy
        (absolute vy))
      (if (if (> vy 0)
            (if (>= y (- bottom-y ball-radius))
              (over-paddle ball bottom-x)
              false)
            false)
        (assoc
          (assoc ball :y (- bottom-y ball-radius))
          :vy
          (- 0 (absolute vy)))
        ball))))

(defn bounce-screen-walls [ball]
  (let [y (get ball :y)
        vy (get ball :vy)]
    (if (<= y ball-radius)
      (assoc (assoc ball :y ball-radius) :vy (absolute vy))
      (if (>= y (- game-height ball-radius))
        (assoc
          (assoc ball :y (- game-height ball-radius))
          :vy
          (- 0 (absolute vy)))
        ball))))

(defn update-state [state]
  (let [tracked (update-paddles state)]
    (let [moved (advance-ball (get tracked :ball))]
      (let [side-bounced (bounce-side-walls moved)]
        (let [paddle-bounced
              (bounce-paddles side-bounced (get tracked :top-x) (get tracked :bottom-x))]
          (assoc tracked :ball (bounce-screen-walls paddle-bounced)))))))

(defn viewport [width height]
  {:width width :height height :left 0 :top 0})

(defn scale-x [view x]
  (/ (* x (get view :width)) game-width))

(defn scale-y [view y]
  (/ (* y (get view :height)) game-height))

(defn scale-width [view width]
  (/ (* width (get view :width)) game-width))

(defn scale-height [view height]
  (/ (* height (get view :height)) game-height))

(defn field-commands [view]
  ;; The whole browser canvas is the playfield. Keeping this command list
  ;; empty avoids drawing a separate framed or tinted "screen" over the hero.
  (list))

(defn paddle-commands [view paddle color]
  (let [left (scale-x view (get paddle :x))
        top (scale-y view (get paddle :y))
        width (scale-width view paddle-width)
        height (larger 6 (scale-height view paddle-height))]
    (list
      [:rect left (- top 4) width (+ height 8) color 0.12]
      [:rect left top width height color 0.96])))

(defn ball-commands [view ball]
  (let [x (scale-x view (get ball :x))
        y (scale-y view (get ball :y))
        radius (larger 6 (scale-width view ball-radius))]
    (list
      [:circle x y (+ radius 8) "#41f5e4" 0.12]
      [:circle x y radius "#f5ffff" 1.0])))

(defn append-commands [commands additions]
  (loop [index 0 result commands]
    (if (< index (count additions))
      (recur (inc index) (conj result (nth additions index)))
      result)))

(defn draw-pong-game [state width height]
  (let [view (viewport width height)]
    (let [field (field-commands view)
          top
          (paddle-commands
            view {:x (get state :top-x) :y top-y} "#ff2e88")
          bottom
          (paddle-commands
            view {:x (get state :bottom-x) :y bottom-y} "#41f5e4")]
      (let [with-top (append-commands field top)]
        (let [with-bottom (append-commands with-top bottom)]
          (let [with-ball
                (append-commands with-bottom (ball-commands view (get state :ball)))]
            (conj
              with-ball
              [:text "PONG.HAL // AUTOPLAY" 18 (- height 18) "#9ab3c7" 12 0.84])))))))

(node/start
  (fn []
    (loop [state (initial-state)]
      (let [frame (co/await (draw/next-frame "canvas/background"))]
        (let [width (get frame "canvas/width")
              height (get frame "canvas/height")
              next-state (update-state state)]
          (do
            (co/await
              (draw/render
                "canvas/background"
                {:type :canvas-2d
                 :background "#02050b"
                 :commands (draw-pong-game next-state width height)}))
            (recur next-state)))))))
`,_e="(+ 19 23)",ze=`(def scores [4 8 15 16 23 42])

(map (fn [score] (* score 2)) scores)

(filter (fn [score] (> score 10)) scores)`,Fe=`(def game
  (atom {:turn :x
         :moves []}))

(swap! game update :moves conj [1 1])
(deref game)`,Ue=`(def +winning-conditions+
  [#{:aa :ab :ac} #{:ba :bb :bc} #{:ca :cb :cc}
   #{:aa :ba :ca} #{:ab :bb :cb} #{:ac :bc :cc}
   #{:aa :bb :cc} #{:ac :bb :ca}])

(defn new-game []
  {:board {:bg #{:aa :ab :ac
                 :ba :bb :bc
                 :ca :cb :cc}
           :p1 #{}
           :p2 #{}}
   :turn :p1
   :status :active
   :winner nil
   :winning-line nil})

(defn subset-of? [condition positions]
  (let [cells (vec condition)]
    (loop [index 0]
      (if (< index (count cells))
        (if (contains? positions (nth cells index))
          (recur (inc index))
          false)
        true))))

(defn winning-condition [positions]
  (loop [index 0]
    (if (< index (count +winning-conditions+))
      (let [condition (nth +winning-conditions+ index)]
        (if (subset-of? condition positions)
          condition
          (recur (inc index))))
      nil)))

(defn next-move
  "Transitions from one game state to the next."
  [game move]
  (let [[side pos] move
        board (get game :board)
        turn (get game :turn)
        status (get game :status)]
    (do
      (when (not= status :active)
        (throw (ex-info "Game has finished." {:game game :move move})))
      (when (not= turn side)
        (throw (ex-info (str "Not " side "'s turn.") {:game game :move move})))
      (when (not (contains? (get board :bg) pos))
        (throw (ex-info "Position already taken." {:game game :move move})))
      (let [new-board
            (assoc
              (assoc board :bg (disj (get board :bg) pos))
              side
              (conj (get board side) pos))]
        (let [line (winning-condition (get new-board side))
              is-full (= 0 (count (get new-board :bg)))]
          (let [is-winner (not (nil? line))]
            {:board new-board
             :turn (if (= side :p1) :p2 :p1)
             :status (if is-winner :done (if is-full :done :active))
             :winner (if is-winner side (if is-full :draw nil))
             :winning-line line}))))))

(next-move (new-game) [:p1 :bb])`,Ye=[{id:"first-eval",title:"First eval",kind:"console",source:_e},{id:"collections",title:"Collections",kind:"console",source:ze},{id:"state",title:"State",kind:"console",source:Fe},{id:"tictactoe-move",title:"Tic-tac-toe",kind:"console",source:Ue},{id:"canvas-pong",title:"Pong",kind:"canvas",source:Ne}],Ve=e=>e?.constructor?.name??"",T=(e,n=new Set)=>{if(e==null)return"nil";if(typeof e=="string")return JSON.stringify(e);if(["number","bigint","boolean"].includes(typeof e))return String(e);const a=Ve(e);if(a==="HtaKeyword")return`:${e.name}`;if(a==="HtaSymbol")return e.name;if(a==="HtaVar")return`#'${T(e.symbol,n)}`;if(a==="HtaHandle")return String(e);if(typeof e=="object"){if(n.has(e))return"#<cycle>";n.add(e)}let t;if(a==="HtaAtom")t=`#atom <${T(e.value,n)}>`;else if(a==="HtaArray")t=`(array${e.values?.length?` ${e.values.map(l=>T(l,n)).join(" ")}`:""})`;else if(a==="HtaObject"){const l=e.entries??[];t=`(object${l.length?` ${l.map(([c,i])=>`${JSON.stringify(c)} ${T(i,n)}`).join(" ")}`:""})`}else if(e instanceof Uint8Array)t=`#bytes[${[...e].join(" ")}]`;else if(Array.isArray(e))t=`[${e.map(l=>T(l,n)).join(" ")}]`;else if(e instanceof Set)t=`#{${[...e].map(l=>T(l,n)).join(" ")}}`;else if(e instanceof Map)t=`{${[...e].map(([l,c])=>`${T(l,n)} ${T(c,n)}`).join(" ")}}`;else if(typeof e=="object"){const l=e.toString?.();t=l&&l!=="[object Object]"?l:`#js {${Object.entries(e).map(([c,i])=>`${JSON.stringify(c)} ${T(i,n)}`).join(" ")}}`}else t=String(e);return typeof e=="object"&&n.delete(e),t},U=e=>String(e?.message??e).replace(/^Error: /,"");async function Ge(e,n){return Promise.race([e,n.then(()=>{throw new Error("canvas task stopped before rendering its first frame")})])}function Je(e){if(typeof e?.cancel!="function")return!1;try{return e.cancel()!==!1}catch{return!1}}function Be(e,{requestFrame:n=globalThis.requestAnimationFrame?.bind(globalThis),setTimer:a=globalThis.setTimeout?.bind(globalThis)}={}){let t=!1;const l=()=>{t||e()};return typeof n=="function"?n(l):a?.(l,0),()=>{t=!0}}const Xe={idle:"Idle",loading:"Connecting",ready:"Connected",busy:"Evaluating",error:"Unavailable"},We=(e,n,a)=>Math.min(a,Math.max(n,e));function Ze(e){const n=document.createElement("div");return n.className="hara-live-card-toast",n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.innerHTML="<i></i><span>Preparing Hara kernel</span><b>0%</b>",n.hidden=!0,e.append(n),{element:n,show(){n.hidden=!1},report(a,t){n.querySelector("span").textContent=a,n.querySelector("b").textContent=`${t??0}%`,n.style.setProperty("--kernel-progress",`${t??0}%`)},fail(a){n.dataset.state="error",n.querySelector("span").textContent=a,n.querySelector("b").textContent=""},remove(){n.remove()}}}function xe(e,{label:n,initialHeight:a,minimumHeight:t,maximumHeight:l=()=>Math.max(t,Math.round((globalThis.innerHeight||900)*.8)),onResize:c=()=>{}}){const i=document.createElement("div");i.className="hara-live-card-resizer",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-label",n),i.setAttribute("aria-orientation","horizontal"),e.append(i);let r=null,u=0,d=0;const o=()=>typeof l=="function"?l():l,h=f=>{const x=Math.round(We(f,t,Math.max(t,o())));return e.style.height=`${x}px`,i.setAttribute("aria-valuemin",String(t)),i.setAttribute("aria-valuemax",String(Math.round(o()))),i.setAttribute("aria-valuenow",String(x)),c(x),x},b=f=>{if(!(r===null||f&&f.pointerId!==r)){try{i.releasePointerCapture?.(r)}catch{}r=null,delete e.dataset.resizing}};return i.addEventListener("pointerdown",f=>{f.pointerType!=="touch"&&f.button!==0||(f.preventDefault(),r=f.pointerId,u=f.clientY,d=e.getBoundingClientRect().height,e.dataset.resizing="true",i.setPointerCapture?.(f.pointerId))}),i.addEventListener("pointermove",f=>{f.pointerId===r&&(f.preventDefault(),h(d+f.clientY-u))}),i.addEventListener("pointerup",b),i.addEventListener("pointercancel",b),i.addEventListener("lostpointercapture",b),i.addEventListener("keydown",f=>{if(!["ArrowUp","ArrowDown","Home","End"].includes(f.key))return;f.preventDefault();const x=e.getBoundingClientRect().height,S=f.shiftKey?48:16;f.key==="ArrowUp"?h(x-S):f.key==="ArrowDown"?h(x+S):f.key==="Home"?h(t):h(o())}),i.addEventListener("dblclick",()=>h(a)),h(a),{handle:i,setHeight:h,destroy:()=>i.remove()}}const Qe=(e,n)=>{const a=n.getBoundingClientRect();return{type:"pointer",phase:e.type==="pointerup"?"up":e.type==="pointermove"?"move":"down",x:Math.round(e.clientX-a.left),y:Math.round(e.clientY-a.top),button:e.button??0,pointer:e.pointerType??"mouse"}};function et(e,{runtimeBase:n,onRunningChange:a=()=>{}}){const t=document.createElement("canvas");t.className="hara-live-card-canvas",t.width=960,t.height=600,t.tabIndex=0,t.setAttribute("aria-label","Live Hara canvas output");const l=document.createElement("section");l.className="hara-live-card-canvas-panel",l.hidden=!0,l.innerHTML=`
    <div class="hara-live-card-canvas-meta">
      <span>ISOLATED · CANVAS/2D</span>
      <output aria-live="polite">Waiting to run</output>
    </div>`,l.append(t),e.append(l);const c=l.querySelector("output"),i="canvas/background";let r=null,u=null,d=null,o=0,h=null,b=null,f=null,x=!1;const S=(w,E="")=>{c.textContent=w,c.dataset.state=E},m=()=>{const w=t.getContext?.("2d");w&&(w.setTransform(1,0,0,1,0,0),w.clearRect(0,0,t.width,t.height),w.fillStyle="#02050b",w.fillRect(0,0,t.width,t.height))},J=xe(l,{label:"Resize canvas",initialHeight:Math.min(500,Math.max(300,Math.round((globalThis.innerHeight||800)*.52))),minimumHeight:220,onResize:()=>r?.resize(t)}),K=async w=>{if(!r){const[E,v]=await Promise.all([he(()=>import(`${n}/studio/broker.js`),[]),he(()=>import(`${n}/studio/canvas-runtime.js`),[])]);u=E.compileAnonymousDocument,r=new v.CanvasRuntime({capabilities:["canvas/2d"],onDiagnostic:g=>S(U(g),"error")}),r.register(i,t),r.resize(t)}d??=w.registerCanvas(r)};for(const w of["pointerdown","pointermove","pointerup"])t.addEventListener(w,E=>{w==="pointerdown"&&t.setPointerCapture?.(E.pointerId),r?.pushEvent(Qe(E,t))});const N=({clear:w=!0,statusText:E="Stopped"}={})=>{if(x)return!1;o+=1;const v=[...new Set([h,b].filter(Boolean))];h=null,b=null;for(const $ of v)r?.release($,i);const g=f;f=null;const O=Je(g);return w&&m(),E!==null&&S(E,"idle"),a(!1),O||v.length>0};return{evaluate:async(w,E)=>{if(x)throw new Error("canvas stage is closed");N({clear:!1,statusText:null});const v=++o,g=`live-card-${v}`;h=g,S("Starting canvas","loading"),await K(w),r.stage(g,i);try{const O=u(E,{documentId:`${location.pathname}/live-card`,nodeId:g}),$=await w.evalRaw(O.source);if(typeof $!="string"||!$.startsWith("task-"))throw new Error(`canvas program did not start a node task: ${T($)}`);const A=r.waitForFirstRender(g,i,8e3),_=w.evalRaw(`(studio.node/run-task ${JSON.stringify($)})`);return f=_,_.then(()=>{_!==f||v!==o||(f=null,r.release(g,i),b===g&&(b=null),h===g&&(h=null),S("Stopped","idle"),a(!1))},B=>{_!==f||v!==o||(f=null,r.release(g,i),b===g&&(b=null),h===g&&(h=null),S(U(B),"error"),a(!1))}),await Ge(A,_),v!==o?(r.release(g,i),{value:null,label:"Canvas interrupted"}):(r.commit(g,i),h=null,b=g,S("Live · Stop or Esc to interrupt","ready"),a(!0),{value:null,label:"Canvas live"})}catch(O){if(r.release(g,i),v!==o)return{value:null,label:"Canvas interrupted"};throw h=null,b=null,f&&v===o&&(f=null),S(U(O),"error"),a(!1),O}},interrupt:N,isRunning:()=>!!(f||h||b),setStatus:S,show(){l.hidden=!1},hide(){l.hidden=!0},close(){x||(N({clear:!1,statusText:null}),x=!0,d?.(),r?.close(),J.destroy(),l.remove())}}}function tt(e){const{value:n,selectionStart:a,selectionEnd:t}=e;if(a===t)return null;const l=n.slice(a,t),c=l.match(/^\s*/)?.[0].length??0,i=l.match(/\s*$/)?.[0].length??0,r=a+c,u=t-i;return r<u?{source:n.slice(r,u),start:r,end:u}:null}function be(e,n=!1){const a=tt(e);if(a)return a;const{value:t,selectionStart:l}=e;if(n){const c=t.lastIndexOf(`
`,Math.max(0,l-1))+1,i=c+(t.slice(c).match(/^\s*/)?.[0].length??0),r=ge(t,i);if(r?.start===i&&r.end>=l)return r}return ge(t,l)}function ke(e,{snippets:n=Ye,activeSnippet:a=null,kernel:t=null,runtimeBase:l="/runtime",docsAssetsBase:c="/docs-assets",kernelModuleUrl:i=null,createKernel:r=null,fetchAsset:u=null,playgroundUrl:d="https://playground.hara-lang.org/"}={}){const o=document.createElement("section");o.className="hara-live-card",o.dataset.connectionState="idle",o.dataset.instarepl="true",o.innerHTML=`
    <header class="hara-live-card-header">
      <span class="hara-live-card-status" title="Kernel status">
        <i class="hara-live-card-connection" aria-hidden="true"></i>
        <small data-live-connection-label>Idle</small>
      </span>
      <button type="button" class="hara-live-card-eval" data-live-eval>Eval</button>
      <button type="button" class="hara-live-card-run" data-live-run>Run</button>
      <button type="button" class="hara-live-card-eval hara-live-card-reset" data-live-reset hidden>Reset</button>
      <div class="hara-live-card-tabs" role="tablist" aria-label="Examples"></div>
      <a class="hara-live-card-playground" target="_blank" rel="noopener">Open in Playground</a>
    </header>
    <div class="hara-live-card-editor">
      <pre class="code-highlight" aria-hidden="true"><code></code></pre>
      <textarea spellcheck="false" wrap="off" aria-label="Hara source editor"></textarea>
    </div>
    <output class="hara-live-card-output" aria-live="polite" hidden></output>`,e.append(o);const h=o.querySelector(".hara-live-card-tabs"),b=o.querySelector(".hara-live-card-playground"),f=o.querySelector(".hara-live-card-editor"),S=o.querySelector(".code-highlight").querySelector("code"),m=o.querySelector("textarea"),J=o.querySelector("[data-live-eval]"),K=o.querySelector("[data-live-run]"),N=o.querySelector("[data-live-reset]"),y=o.querySelector(".hara-live-card-output"),w=o.querySelector("[data-live-connection-label]");b.href=d;const E=new Map(n.map(s=>[s.id,s]));let v=E.get(a)??n[0]??null,g=!1;const O=s=>{g=!!s,o.dataset.canvasRunning=String(g),K.textContent=g?"Stop":"Run",K.setAttribute("aria-label",g?"Interrupt running canvas":"Run example"),K.classList.toggle("hara-live-card-run",!g),K.classList.toggle("hara-live-card-eval",g),N.hidden=v?.kind!=="canvas"&&!g},$=Ze(o),A=et(o,{runtimeBase:l,onRunningChange:O}),_=`live-${Math.random().toString(36).slice(2)}`;let B=t?Promise.resolve(t):null,I=null,F=null,P=0,D=!1,X=null,Y=!1,j=null,oe=0;const H=(s,p=null)=>{o.dataset.connectionState=s;const k=Xe[s]??s;w.textContent=p?`${k}: ${U(p)}`:k,o.querySelector(".hara-live-card-status").setAttribute("aria-label",p?`${k}: ${U(p)}`:`Kernel ${k}`)},te=()=>[...h.querySelectorAll("button")],ne=s=>{J.disabled=s,K.disabled=s&&!g,N.disabled=s;for(const p of te())p.disabled=s},Ee=()=>(B??=qe({runtimeBase:l,docsAssetsBase:c,kernelModuleUrl:i,createKernel:r,fetchAsset:u,onProgress:(s,p)=>$.report(s,p)}),B),$e=()=>I||(H("loading"),$.show(),$.report("Preparing Hara kernel",0),I=Ee().then(s=>($.report("Starting session",99),s.createSession(_))).then(s=>(D||($.remove(),H("ready")),s)).catch(s=>{throw I=null,$.fail("Kernel unavailable"),H("error",s),s}),I),M=()=>{S.innerHTML=Me(m.value,{evalRange:F}),S.style.transform=`translate(${-m.scrollLeft}px, ${-m.scrollTop}px)`},Ae=xe(f,{label:"Resize editor",initialHeight:230,minimumHeight:150,onResize:M}),de=typeof ResizeObserver=="function"?new ResizeObserver(M):null;de?.observe(f);const ae=()=>{y.hidden=!0,delete y.dataset.state,delete y.dataset.mode,y.textContent="",v?.kind==="canvas"?A.show():A.hide(),O(A.isRunning())},le=({clear:s=!0,statusText:p="Stopped"}={})=>{P+=1;const k=A.interrupt({clear:s,statusText:p});return I&&H("ready"),ne(!1),k},ce=()=>{P+=1,A.interrupt({clear:!0,statusText:v?.kind==="canvas"?"Waiting to run":null}),F=null,v&&(m.value=v.source),M(),ae(),I&&H("ready")},se=(s,{focus:p=!1}={})=>{const k=E.get(s);if(k){k!==v&&(P+=1,A.interrupt({clear:!0,statusText:null}),v=k,F=null,m.value=k.source,M(),ae());for(const L of te()){const q=L.dataset.snippetId===k.id;L.setAttribute("aria-selected",String(q)),L.tabIndex=q?0:-1,q&&p&&L.focus()}}};for(const s of n){const p=document.createElement("button");p.type="button",p.setAttribute("role","tab"),p.dataset.snippetId=s.id,p.textContent=s.title,p.setAttribute("aria-selected",String(s===v)),p.tabIndex=s===v?0:-1,p.addEventListener("click",()=>se(s.id)),h.append(p)}h.addEventListener("keydown",s=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(s.key))return;const p=te();if(!p.length)return;s.preventDefault();const k=Math.max(0,p.indexOf(document.activeElement)),L=s.key==="Home"?0:s.key==="End"?p.length-1:(k+(s.key==="ArrowRight"?1:-1)+p.length)%p.length;se(p[L].dataset.snippetId,{focus:!0})});const ue=async({source:s,mode:p,range:k=null})=>{if(!v||!s?.trim())return;const L=++P,q=p==="run"&&v.kind==="canvas";F=k,M(),ne(!0),y.hidden=q,q||(y.dataset.state="pending",y.dataset.mode=p,y.textContent="Evaluating…");let Z=null;try{if(Z=await $e(),L!==P||D)return;H("busy");const Q=q?await A.evaluate(Z,s):await Z.eval(s);if(L!==P||D)return;H("ready"),q||(y.hidden=!1,y.dataset.state="ready",y.textContent=Q.label??T(Q.value))}catch(Q){if(L!==P||D)return;Z&&H("ready"),y.hidden=!1,y.dataset.state="error",y.textContent=U(Q)}finally{L===P&&!D&&ne(!1)}},W=async({preferLine:s=!1}={})=>{const p=be(m,s);if(!p?.source){y.hidden=!1,y.dataset.state="error",y.dataset.mode="eval",y.textContent="Click or tap inside a form, or select source to evaluate.";return}await ue({source:p.source,mode:"eval",range:p})},fe=()=>ue({source:m.value,mode:"run",range:null}),pe=()=>A.isRunning()?le():fe();return m.addEventListener("keydown",s=>{if((s.metaKey||s.ctrlKey)&&s.key==="Enter"){s.preventDefault(),pe();return}if(s.altKey&&s.key==="Enter"||s.ctrlKey&&!s.metaKey&&!s.altKey&&s.key.toLowerCase()==="e"){s.preventDefault(),W();return}if(s.ctrlKey&&!s.metaKey&&!s.altKey&&s.key.toLowerCase()==="k"&&je(m)){s.preventDefault();return}if(s.ctrlKey&&!s.metaKey&&!s.altKey&&(s.key==="ArrowRight"?Ie:s.key==="ArrowLeft"?Pe:null)?.(m)){s.preventDefault();return}if(!s.metaKey&&!s.ctrlKey&&!s.altKey&&Te(m,s.key)){s.preventDefault();return}s.key==="Tab"&&(s.preventDefault(),s.shiftKey?Ce(m,!0):Oe(m))}),o.addEventListener("keydown",s=>{!(s.key==="Escape"||s.ctrlKey&&!s.metaKey&&s.key===".")||!A.isRunning()||(s.preventDefault(),le())}),m.addEventListener("input",()=>{F=null,M()}),m.addEventListener("scroll",M),m.addEventListener("select",()=>{const s=be(m,!0);F=s?{start:s.start,end:s.end}:null,M()}),m.addEventListener("pointerdown",s=>{!s.isPrimary||s.pointerType!=="touch"&&s.button!==0||(j?.(),j=null,Y=!1,X={id:s.pointerId,x:s.clientX,y:s.clientY})}),m.addEventListener("pointerup",s=>{const p=X;X=null,!(!p||p.id!==s.pointerId)&&(Math.hypot(s.clientX-p.x,s.clientY-p.y)>8||(Y=!0))}),m.addEventListener("click",()=>{Y&&(Y=!1,j?.(),j=Be(()=>{if(j=null,D||m.selectionStart!==m.selectionEnd)return;const s=Date.now();s-oe<280||(oe=s,W({preferLine:!0}))}))}),m.addEventListener("pointercancel",()=>{X=null,Y=!1,j?.(),j=null}),J.addEventListener("click",()=>W({preferLine:!0})),K.addEventListener("click",pe),N.addEventListener("click",ce),v&&(m.value=v.source),se(v?.id??""),M(),ae(),{eval:W,run:fe,interrupt:le,reset:ce,destroy(){if(D)return;D=!0,P+=1,j?.(),j=null,de?.disconnect(),Ae.destroy(),A.close();const s=I;I=null,s&&s.then(p=>p.close?.()).catch(()=>{}),o.remove()}}}const nt=`(ns+)

(require [studio.draw :as draw])

;; Pong
;; Full-screen autonomous Pong. Both horizontal paddles track the ball while
;; the ball bounces from the viewport edges and the paddle faces.
;; TRY: change paddle-speed to make the rally more or less forgiving.
;; TRY: change the initial vx/vy values to alter the rhythm.

(def game-width 1000)
(def game-height 600)
(def ball-radius 12)
(def paddle-width 180)
(def paddle-height 16)
(def paddle-speed 8)
(def top-y 48)
(def bottom-y (- game-height 64))

(defn smaller [a b] (if (< a b) a b))
(defn larger [a b] (if (> a b) a b))
(defn absolute [value] (if (neg? value) (- 0 value) value))
(defn clamp [value low high]
  (if (< value low) low (if (> value high) high value)))

(defn initial-state []
  {:top-x (/ (- game-width paddle-width) 2)
   :bottom-x (/ (- game-width paddle-width) 2)
   :ball {:x (/ game-width 2)
          :y (/ game-height 2)
          :vx 6
          :vy 5}})

(defn track-paddle [position target speed]
  (let [delta (- target (+ position (/ paddle-width 2)))]
    (let [step (clamp delta (- 0 speed) speed)]
      (clamp (+ position step) 0 (- game-width paddle-width)))))

(defn update-paddles [state]
  (let [ball-x (get (get state :ball) :x)]
    (let [top-x (track-paddle (get state :top-x) ball-x paddle-speed)
          bottom-x (track-paddle (get state :bottom-x) ball-x paddle-speed)]
      (assoc (assoc state :top-x top-x) :bottom-x bottom-x))))

(defn advance-ball [ball]
  (assoc
    (assoc ball :x (+ (get ball :x) (get ball :vx)))
    :y
    (+ (get ball :y) (get ball :vy))))

(defn bounce-side-walls [ball]
  (let [x (get ball :x)
        vx (get ball :vx)]
    (if (<= x ball-radius)
      (assoc (assoc ball :x ball-radius) :vx (absolute vx))
      (if (>= x (- game-width ball-radius))
        (assoc
          (assoc ball :x (- game-width ball-radius))
          :vx
          (- 0 (absolute vx)))
        ball))))

(defn over-paddle [ball paddle-x]
  (let [x (get ball :x)]
    (if (>= x (- paddle-x ball-radius))
      (<= x (+ paddle-x paddle-width ball-radius))
      false)))

(defn bounce-paddles [ball top-x bottom-x]
  (let [y (get ball :y)
        vy (get ball :vy)]
    (if (if (< vy 0)
          (if (<= y (+ top-y paddle-height ball-radius))
            (over-paddle ball top-x)
            false)
          false)
      (assoc
        (assoc ball :y (+ top-y paddle-height ball-radius))
        :vy
        (absolute vy))
      (if (if (> vy 0)
            (if (>= y (- bottom-y ball-radius))
              (over-paddle ball bottom-x)
              false)
            false)
        (assoc
          (assoc ball :y (- bottom-y ball-radius))
          :vy
          (- 0 (absolute vy)))
        ball))))

(defn bounce-screen-walls [ball]
  (let [y (get ball :y)
        vy (get ball :vy)]
    (if (<= y ball-radius)
      (assoc (assoc ball :y ball-radius) :vy (absolute vy))
      (if (>= y (- game-height ball-radius))
        (assoc
          (assoc ball :y (- game-height ball-radius))
          :vy
          (- 0 (absolute vy)))
        ball))))

(defn update-state [state]
  (let [tracked (update-paddles state)]
    (let [moved (advance-ball (get tracked :ball))]
      (let [side-bounced (bounce-side-walls moved)]
        (let [paddle-bounced
              (bounce-paddles side-bounced (get tracked :top-x) (get tracked :bottom-x))]
          (assoc tracked :ball (bounce-screen-walls paddle-bounced)))))))

(defn viewport [width height]
  {:width width :height height :left 0 :top 0})

(defn scale-x [view x]
  (/ (* x (get view :width)) game-width))

(defn scale-y [view y]
  (/ (* y (get view :height)) game-height))

(defn scale-width [view width]
  (/ (* width (get view :width)) game-width))

(defn scale-height [view height]
  (/ (* height (get view :height)) game-height))

(defn field-commands [view]
  ;; The whole browser canvas is the playfield. Keeping this command list
  ;; empty avoids drawing a separate framed or tinted "screen" over the hero.
  (list))

(defn paddle-commands [view paddle color]
  (let [left (scale-x view (get paddle :x))
        top (scale-y view (get paddle :y))
        width (scale-width view paddle-width)
        height (larger 6 (scale-height view paddle-height))]
    (list
      [:rect left (- top 4) width (+ height 8) color 0.12]
      [:rect left top width height color 0.96])))

(defn ball-commands [view ball]
  (let [x (scale-x view (get ball :x))
        y (scale-y view (get ball :y))
        radius (larger 6 (scale-width view ball-radius))]
    (list
      [:circle x y (+ radius 8) "#41f5e4" 0.12]
      [:circle x y radius "#f5ffff" 1.0])))

(defn append-commands [commands additions]
  (loop [index 0 result commands]
    (if (< index (count additions))
      (recur (inc index) (conj result (nth additions index)))
      result)))

(defn draw-pong-game [state width height]
  (let [view (viewport width height)]
    (let [field (field-commands view)
          top
          (paddle-commands
            view {:x (get state :top-x) :y top-y} "#ff2e88")
          bottom
          (paddle-commands
            view {:x (get state :bottom-x) :y bottom-y} "#41f5e4")]
      (let [with-top (append-commands field top)]
        (let [with-bottom (append-commands with-top bottom)]
          (let [with-ball
                (append-commands with-bottom (ball-commands view (get state :ball)))]
            (conj
              with-ball
              [:text "PONG.HAL // AUTOPLAY" 18 (- height 18) "#9ab3c7" 12 0.84])))))))

(node/start
  (fn []
    (loop [state (initial-state)]
      (let [frame (co/await (draw/next-frame "canvas/background"))]
        (let [width (get frame "canvas/width")
              height (get frame "canvas/height")
              next-state (update-state state)]
          (do
            (co/await
              (draw/render
                "canvas/background"
                {:type :canvas-2d
                 :background "#02050b"
                 :commands (draw-pong-game next-state width height)}))
            (recur next-state)))))))
`,at=[{id:"read",title:"Read",kind:"console",source:"(+ 19 23)"},{id:"transform",title:"Transform",kind:"console",source:`(def player
  {:name "Nova"
   :score 0})

(assoc player :score 10)`},{id:"state",title:"State",kind:"console",source:`(def game
  (atom {:turn :x
         :moves []}))

(swap! game update :moves conj [1 1])
(deref game)`}],me=document.querySelector("[data-live-learn]");me&&ke(me,{snippets:at,activeSnippet:"read"});const ve=document.querySelector("[data-live-canvas]");ve&&ke(ve,{snippets:[{id:"canvas-pong",title:"Pong",kind:"canvas",source:nt}],activeSnippet:"canvas-pong"});const z=[...document.querySelectorAll("[data-kernel-tab]")],lt=document.querySelector(".kernel-mode-tabs"),Se=(e,n=!1)=>{for(const a of z){const t=a.dataset.kernelTab===e;a.setAttribute("aria-selected",String(t)),a.tabIndex=t?0:-1,t&&n&&a.focus()}document.querySelectorAll("[data-kernel-mode]").forEach(a=>{a.hidden=a.dataset.kernelMode!==e})};for(const e of z)e.addEventListener("click",()=>Se(e.dataset.kernelTab??"java"));lt?.addEventListener("keydown",e=>{if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault();const n=Math.max(0,z.findIndex(c=>c===document.activeElement)),a=e.key==="ArrowDown"||e.key==="ArrowRight",t=e.key==="Home"?0:e.key==="End"?z.length-1:(n+(a?1:-1)+z.length)%z.length,l=z[t];l&&Se(l.dataset.kernelTab??"java",!0)});
