const hmrMode = location.hostname == "127.0.0.1" || location.hostname == "localhost";

const HMR = {
    Time: 0,
    /** @type {Record<string, string>} */
    Temp:{},
    Tick()
    {
        for(const k in HMR.Temp)
        {
            sessionStorage.setItem(k, HMR.Temp[k]);
        } 
        HMR.Temp = {};
        HMR.Time = 0;
    },
    /** @type {(key:string, value:string)=>void} */
    Save(key, value)
    {
        this.Temp[key] = value;
        if(!this.Time)
        {
            this.Time = setTimeout(this.Tick, 500);
        }
        console.log("SAVE", key, value);
    },
    /** @type {(key:string)=>string|null} */
    Load(key)
    {
        const value = sessionStorage.getItem(key);
        console.log("LOAD", key, value);
        return value;
    },

    /** @type {string|undefined} */
    _ID: undefined,
    _index: 0,
    /** @type {(id:string|undefined = undefined)=>void} */
    StartID(id)
    {
        this._index = 0;
        this._ID = id;
    },
    NextID()
    {
        return this._ID ? this._ID + "_" + (this._index++) + "_" : "";
    },

    BindVan()
    {
        //bind Van
        const origninalState = globalThis.van.state;
        globalThis.van.state =(value, key=false)=>
        {
            if(key)
            {
                const type = typeof value;
                let reader =d=>d;
                let writer =d=>d?.toString() || null;
    
                switch(type)
                {
                    case "boolean" :
                        reader =(data)=> data === "true"; break;
                    case "number" :
                        reader = parseFloat; break;
                    case "object" :
                        reader = JSON.parse;
                        writer = JSON.stringify;
                        break;
                }
    
                const fullKey = "HMR_" + HMR.NextID() + key;
                const stringValue = HMR.Load(fullKey);
                const signal = origninalState((stringValue ? reader(stringValue) : value));
                van.derive(()=>HMR.Save(fullKey, writer(signal.val)));
    
                return signal;
            }
            else
            {
                return origninalState(value);
            }
            
        };
    },

    BindVanX()
    {
        //bind VanX
        const originalReactive = globalThis.vanX.reactive;
        globalThis.vanX.reactive =(obj, id)=>
        {
            HMR.StartID(id);
            const state = originalReactive(obj);
            HMR.StartID();
            return state;
        }
    }

}

// van:
{let e,t,r,o,n,l,s,i,f,h,w,a,d,u,_,c,S,g,y,b,m,v,j,x,O;s=Object.getPrototypeOf,f={},h=s(i={isConnected:1}),w=s(s),a=(e,t,r,o)=>(e??(setTimeout(r,o),new Set)).add(t),d=(e,t,o)=>{let n=r;r=t;try{return e(o)}catch(e){return console.error(e),o}finally{r=n}},u=e=>e.filter(e=>e.t?.isConnected),_=e=>n=a(n,e,()=>{for(let e of n)e.o=u(e.o),e.l=u(e.l);n=l},1e3),c={get val(){return r?.i?.add(this),this.rawVal},get oldVal(){return r?.i?.add(this),this.h},set val(o){r?.u?.add(this),o!==this.rawVal&&(this.rawVal=o,this.o.length+this.l.length?(t?.add(this),e=a(e,this,x)):this.h=o)}},S=e=>({__proto__:c,rawVal:e,h:e,o:[],l:[]}),g=(e,t)=>{let r={i:new Set,u:new Set},n={f:e},l=o;o=[];let s=d(e,r,t);s=(s??document).nodeType?s:new Text(s);for(let e of r.i)r.u.has(e)||(_(e),e.o.push(n));for(let e of o)e.t=s;return o=l,n.t=s},y=(e,t=S(),r)=>{let n={i:new Set,u:new Set},l={f:e,s:t};l.t=r??o?.push(l)??i,t.val=d(e,n,t.rawVal);for(let e of n.i)n.u.has(e)||(_(e),e.l.push(l));return t},b=(e,...t)=>{for(let r of t.flat(1/0)){let t=s(r??0),o=t===c?g(()=>r.val):t===w?g(r):r;o!=l&&e.append(o)}return e},m=(e,t,...r)=>{let[{is:o,...n},...i]=s(r[0]??0)===h?r:[{},...r],a=e?document.createElementNS(e,t,{is:o}):document.createElement(t,{is:o});for(let[e,r]of Object.entries(n)){let o=t=>t?Object.getOwnPropertyDescriptor(t,e)??o(s(t)):l,n=t+","+e,i=f[n]??=o(s(a))?.set??0,h=e.startsWith("on")?(t,r)=>{let o=e.slice(2);a.removeEventListener(o,r),a.addEventListener(o,t)}:i?i.bind(a):a.setAttribute.bind(a,e),d=s(r??0);e.startsWith("on")||d===w&&(r=y(r),d=c),d===c?g(()=>(h(r.val,r.h),a)):h(r)}return b(a,i)},v=e=>({get:(t,r)=>m.bind(l,e,r)}),j=(e,t)=>t?t!==e&&e.replaceWith(t):e.remove(),x=()=>{let r=0,o=[...e].filter(e=>e.rawVal!==e.h);do{t=new Set;for(let e of new Set(o.flatMap(e=>e.l=u(e.l))))y(e.f,e.s,e.t),e.t=l}while(++r<100&&(o=[...t]).length);let n=[...e].filter(e=>e.rawVal!==e.h);e=l;for(let e of new Set(n.flatMap(e=>e.o=u(e.o))))j(e.t,g(e.f,e.t)),e.t=l;for(let e of n)e.h=e.rawVal},O={tags:new Proxy(e=>new Proxy(m,v(e)),v()),hydrate:(e,t)=>j(e,g(t,e)),add:b,state:S,derive:y},window.van=O;}
hmrMode && HMR.BindVan();


// vanX:
{let e,t,r,{fromEntries:o,entries:l,keys:n,hasOwn:f,getPrototypeOf:a}=Object,{get:i,set:y,deleteProperty:c,ownKeys:s}=Reflect,{state:m,derive:d,add:u}=van,b=1e3,w=Symbol(),A=Symbol(),S=Symbol(),_=Symbol(),g=Symbol(),p=Symbol(),P=e=>(e[A]=1,e),v=e=>e instanceof Object&&!(e instanceof Function)&&!e[p],h=e=>{if(e?.[A]){let t=m();return d(()=>{let r=e();v(t.rawVal)&&v(r)?B(t.rawVal,r):t.val=x(r)}),t}return m(x(e))},F=e=>{let t=Array.isArray(e)?[]:{__proto__:a(e)};for(let[r,o]of l(e))t[r]=h(o);return t[S]=[],t[_]=m(1),t},O={get:(e,t,r)=>t===w?e:f(e,t)?Array.isArray(e)&&"length"===t?(e[_].val,e.length):e[t].val:i(e,t,r),set:(e,o,l,n)=>f(e,o)?Array.isArray(e)&&"length"===o?(l!==e.length&&++e[_].val,e.length=l,1):(e[o].val=x(l),1):o in e?y(e,o,l,n):y(e,o,h(l))&&(++e[_].val,C(e).forEach(E.bind(t,n,o,e[o],r)),1),deleteProperty:(e,t)=>(c(e,t)&&R(e,t),++e[_].val),ownKeys:e=>(e[_].val,s(e))},x=e=>!v(e)||e[w]?e:new Proxy(F(e),O),D=e=>(e[p]=1,e),j=e=>e[w],K=a(m()),N=e=>new Proxy(e,{get:(e,t,r)=>a(e[t]??0)===K?{val:k(e[t].rawVal)}:i(e,t,r)}),k=e=>e?.[w]?new Proxy(N(e[w]),O):e,C=e=>e[S]=e[S].filter(e=>e.t.isConnected),E=(e,t,r,o,{t:l,f:f})=>{let a=Array.isArray(e),i=a?Number(t):t;u(l,()=>l[g][t]=f(r,()=>delete e[t],i)),a&&!o&&i!==e.length-1&&l.insertBefore(l.lastChild,l[g][n(e).find(e=>Number(e)>i)])},R=(e,t)=>{for(let r of C(e)){let e=r.t[g];e[t]?.remove(),delete e[t]}},T=r=>(e??(setTimeout(()=>(e.forEach(C),e=t),b),e=new Set)).add(r),q=(e,t,r)=>{let o={t:e instanceof Function?e():e,f:r},n=t[w];o.t[g]={},n[S].push(o),T(n);for(let[e,r]of l(n))E(t,e,r,1,o);return o.t},z=(e,t)=>{for(let[r,o]of l(t)){let t=e[r];v(t)&&v(o)?z(t,o):e[r]=o}for(let r in e)f(t,r)||delete e[r];let r=n(t),o=Array.isArray(e);if(o||n(e).some((e,t)=>e!==r[t])){let l=e[w];if(o)e.length=t.length;else{++l[_].val;let e={...l};for(let e of r)delete l[e];for(let t of r)l[t]=e[t]}for(let{t:e}of C(l)){let{firstChild:t,[g]:o}=e;for(let l of r)t===o[l]?t=t.nextSibling:e.insertBefore(o[l],t)}}return e},B=(e,n)=>{r=1;try{return z(e,n instanceof Function?Array.isArray(e)?n(e.filter(e=>1)):o(n(l(e))):n)}finally{r=t}},G=e=>Array.isArray(e)?e.filter(e=>1).map(G):v(e)?o(l(e).map(([e,t])=>[e,G(t)])):e;window.vanX={calc:P,reactive:x,noreactive:D,stateFields:j,raw:k,list:q,replace:B,compact:G}}
hmrMode && HMR.BindVanX();

/** @type {Gale.CreateSheet} */
globalThis.Gale = (sheet, hash="")=>
{
    const KeyQuery = "@";
    const KeyState = ":";
    const KeyChild = ".";
    const KeyGroup = "^";
    
    /** @type {Gale.Tier} */
    const Tier=(selector, obj, suffix)=>
    {
        const styles = Object.keys(obj).map((key)=>
        {
            const value = obj[key];
            switch(key[0])
            {
                case KeyQuery :
                    return Tier(`@media(max-width:${key.substring(KeyQuery.length)})`, value, suffix);
                case KeyState :
                    return Tier(`&${key}`, value, suffix);
                case KeyChild :
                    return Tier(`${key}${suffix}`, value, suffix);
                case KeyGroup :
                    return Tier(`&:hover .${key.substring(KeyGroup.length)}${suffix}`, value, suffix);
            }
            return `${ key.replace(/([a-z])([A-Z])/g, '$1-$2') }: ${value};`
        });
    
        return `${selector}{${styles.join("\n")}}`;
    }

    /** @type {(needle:string, str:string)=>string} */
    const extractLast =(needle, str)=>{
        const ind = str.lastIndexOf(needle)+needle.length;
        return ind ? str.substring(ind) : str;
    }

    const collect =(tagName)=>
    {
        const pending = van.tags[tagName];
        let mentioned = [];
        const collector = new Proxy(
            (...args)=>
            {
                const element = pending(...args);
                element.className = mentioned.join(id+" ")+id + " " + element.className;
                mentioned = [];
                return element;
            },
            {
                get(_, prop)
                {
                    mentioned.push(prop.substring(prop.lastIndexOf(".")+1));
                    return collector;
                }
            }
        );
        return collector;
    }

    const id = hash ? "_"+hash : "";
    const css = Object.keys(sheet).map(key=>Tier("."+key+id, sheet[key], id)).join(`\n`);
    globalThis.document?.head.insertAdjacentHTML("beforeend", `<style data-sheet="${id}">${css}</style>`);

    return {
        Tag(...args){
            return args.map((arg)=>extractLast(KeyGroup, extractLast(KeyChild, arg))).join(id+" ")+id;
        },
        CSS: css,
        DOM: new Proxy(
            {},
            {
                get(_, prop)
                {
                    return collect(prop)
                }
            }
        ),
        Div: new Proxy(
            {},
            {
                get(_, prop)
                {
                    return collect("div")[prop]
                }
            }
        )
    }
}

const importURL = new URL(import.meta.url);
const passed = importURL.searchParams.get("entry")
if(passed)
{
    import(new URL(passed, location));
}
