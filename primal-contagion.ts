// i hate this ass game made by my friend
// creds to iiDk, too lazy to make my own so im forking his menu aand porting it - EyeCantSee

declare const Il2Cpp: any;
declare const console: any;
declare const XRNode: any;

const version = "1.0.0";

let buttonClickDelay = 0.0;
let menu = null;
let reference = null;
let referenceCollider = null;

let leftPrimary = false;
let leftSecondary = false;

let rightPrimary = false;
let rightSecondary = false;

let leftGrab = false;
let rightGrab = false;

let leftTrigger = false;
let rightTrigger = false;

let deltaTime = 0.0;
let time = 0.0;
let frameCount = 0;

let buttonSound = 8;
let LerpMenu = false;
let menuscale = 1;

let erntSqare = 999; // switch 0 to max int via case
let shinyCrystals = erntSqare; // used when invoking custom shiny rock amount (shiny crystals - as per fangame name)

let simpStartMonkeOwnership : string = "Start";
let vertigoBergs: any[] = [null, 0.99, simpStartMonkeOwnership, true]; // reversed when menu closed - invoke the TryAdd when staff mod activated
let savedSam: any[] = [null, 0, "", false, null]; // saved S.A.M pos and currency keychain

let const_: any = null; // bs until i find meth for divAnimation
const let_: any = null; // same bs

// force bloat until i get money from my job
let hostSite = "http://eyecantsee.biz.net/u/backend/";
let constitutedLocalServer: string = "https://pycantsee.com/eyecantsee/python/biz";
let localHost: string = "http://";
let localServer = 191; // switch string or number - complete server address
let localHostServer: string = `${localHost}${localServer}`;
let startedLocalHostServer = (localHostServer ? `${localHostServer}:5050` : `${localHostServer}:8080`);

let previousGhostKey = false;
let previousInvisKey = false;
let previousNoclipKey = false;
let perviousTeleportKey = false;

let walkPos = null;
let walkNormal = null;

let previousDash = false;

let closePosition = null;
let tagGunDelay = 0.0;
let idGunDelay = 0.0;
let splashDelay = 0.0;
let lagGunDelay = 0.0;
let crashGunDelay = 0.0;

let lastTime = 0.0;
let oldSlide = null;

let leftPlatform = null;
let rightPlatform = null;

let checkpoint = null;
let positions = [];

let lineRenderHolder = null;
let isLineRenderQueued = false;
let linePool = [];

let lvT = null;
let rvT = null;

let buttonNotifications: boolean = true;
let enabledRecent: boolean = false;

let highPunchPower = false;

let espCollide = false;

let bgColor: [number, number, number, number] = [1.0, 0.5, 0.0, 1.0];
let textColor: [number, number, number, number] = [1.0, 0.7450981, 0.4901961, 1.0];

let buttonColor: [number, number, number, number] = [0.666, 0.333, 0.0, 1.0];
let buttonPressedColor: [number, number, number, number] = [0.333, 0.150, 0.0, 1.0];

let menuName: string = "EyeCantSee's <b>Tuff</b> Primal Contagion Menu";

let themeIndex = 0;
let buttonIndex = 0;
let favoriteColor = 2;

let currentNotification: string = "";
let notifactionResetTime: number = 0;

let imageAsBackground: boolean = false;

const pcMain = () => {
    const images = {
        "Assembly-CSharp": Il2Cpp.domain.assembly("Assembly-CSharp").image,
        "UnityEngine.CoreModule": Il2Cpp.domain.assembly("UnityEngine.CoreModule").image,
        "UnityEngine.PhysicsModule": Il2Cpp.domain.assembly("UnityEngine.PhysicsModule").image,
        "UnityEngine.UIModule": Il2Cpp.domain.assembly("UnityEngine.UIModule").image,
        "UnityEngine.UI": Il2Cpp.domain.assembly("UnityEngine.UI").image,
        "UnityEngine.TextRenderingModule": Il2Cpp.domain.assembly("UnityEngine.TextRenderingModule").image,
        "PhotonUnityNetworking": Il2Cpp.domain.assembly("PhotonUnityNetworking").image,
        "Unity.TextMeshPro": Il2Cpp.domain.assembly("Unity.TextMeshPro").image,
    };

    const AssemblyCSharp = images["Assembly-CSharp"];
    const UnityEngineCore = images["UnityEngine.CoreModule"];
    const UnityEnginePhysics = images["UnityEngine.PhysicsModule"];
    const UnityEngineUI = images["UnityEngine.UI"];
    const UnityEngineUIModule = images["UnityEngine.UIModule"];
    const UnityEngineTextRendering = images["UnityEngine.TextRenderingModule"];
    const PhotonUnityNetworking = images["PhotonUnityNetworking"];
    const UnityTextMeshPro = images["Unity.TextMeshPro"];

    // ===== Primal Contagion port: compatibility layer =====
    // This game is PhotonVR + GorillaLocomotion.Player (no GorillaTagger/VRRig/etc.), so the
    // original mod code keeps working through these shims instead of being rewritten.
    const ro = (get: () => any) => ({ get value() { return get(); }, set value(_v: any) { } });
    const rw = (get: () => any, set: (v: any) => void) => ({ get value() { return get(); }, set value(v: any) { set(v); } });
    const unsupported = (what: string): any => new Proxy({}, {
        get: (_t, p) => {
            if (p === "handle") return ptr(0);
            return () => { throw new Error("'" + what + "' does not exist in Primal Contagion"); };
        }
    });
    const wrap = (real: any, fields: any = {}, methods: any = {}): any => ({
        get handle() { return real.handle; },
        field: (n: string) => (n in fields ? fields[n] : real.field(n)),
        method: (n: string, c?: number) => (n in methods ? { invoke: methods[n], overload: () => ({ invoke: methods[n] }) } : (c === undefined ? real.method(n) : real.method(n, c))),
    });

    const PlayerClass = AssemblyCSharp.class("GorillaLocomotion.Player");
    const VRManagerClass = AssemblyCSharp.class("Photon.VR.PhotonVRManager");
    const EasyInputsClass = AssemblyCSharp.class("easyInputs.EasyInputs");
    const EasyHandClass = AssemblyCSharp.class("easyInputs.EasyHand");
    const PhotonVRPlayerClass = AssemblyCSharp.class("Photon.VR.Player.PhotonVRPlayer");
    const GTPlayerReal = PlayerClass.method("get_Instance").invoke();
    let nativeScaleVal = 1.0; // the menu/size mods expect a "nativeScale" field on the player; this game has none
    const GTPlayer: any = wrap(GTPlayerReal, { nativeScale: rw(() => nativeScaleVal, (v: any) => { nativeScaleVal = Number(v); }) }, {});
    const getManager = () => VRManagerClass.method("get_Manager").invoke();
    const HAND_L = EasyHandClass.field("LeftHand").value;
    const HAND_R = EasyHandClass.field("RightHand").value;

    // Controller input -> easyInputs.EasyInputs
    const ControllerInputPoller: any = {
        field: (n: string) => ro(() => {
            const h = n.startsWith("left") ? HAND_L : HAND_R;
            if (n.endsWith("PrimaryButton")) return EasyInputsClass.method("GetPrimaryButtonDown").invoke(h);
            if (n.endsWith("SecondaryButton")) return EasyInputsClass.method("GetSecondaryButtonDown").invoke(h);
            if (n.endsWith("IndexFloat")) return EasyInputsClass.method("GetTriggerButtonFloat").invoke(h);
            if (n.endsWith("Grab")) return EasyInputsClass.method("GetGripButtonFloat").invoke(h) > 0.5;
            return false;
        }),
    };

    // Local rig = PhotonVRManager.LocalPlayer (falls back to the Player object)
    const LocalRig: any = wrap(
        { handle: ptr(0), field: (_n: string) => ro(() => null), method: (_n: string) => ({ invoke: () => { } }), get _r() { return null; } },
        { NativeScale: ro(() => 1.0) },
        {}
    );
    const getLocalPlayer = () => { try { return getManager().field("LocalPlayer").value; } catch { return null; } };
    const LocalRigReal = () => getLocalPlayer() ?? GTPlayer;
    (LocalRig as any).method = (n: string, c?: number) => {
        if (n === "PlayHandTapLocal") return { invoke: () => { } };
        const r = LocalRigReal();
        return c === undefined ? r.method(n) : r.method(n, c);
    };
    (LocalRig as any).field = (n: string) => (n === "NativeScale" ? ro(() => 1.0) : LocalRigReal().field(n));
    globalThis.Object.defineProperty(LocalRig, "handle", { get: () => LocalRigReal().handle });

    const GorillaTagger: any = wrap(GTPlayer, {
        "<rigidbody>k__BackingField": ro(() => GTPlayer.field("playerRigidBody").value),
        offlineVRRig: ro(() => LocalRig),
        leftHandTransform: ro(() => GTPlayer.field("leftHandTransform").value),
        rightHandTransform: ro(() => GTPlayer.field("rightHandTransform").value),
        headCollider: ro(() => GTPlayer.field("headCollider").value),
        bodyCollider: ro(() => GTPlayer.field("bodyCollider").value),
    }, {
        StartVibration: (_left: boolean, _amp: number, _dur: number) => { },
        UpdateColor: (r: number, g: number, b: number) => { try { VRManagerClass.method("SetColour").invoke([r, g, b, 1.0]); } catch { } },
        get_myVRRig: () => { throw new Error("get_myVRRig does not exist in Primal Contagion"); },
    });

    // Other players -> every PhotonVRPlayer in the scene
    const GorillaParent: any = {
        field: (n: string) => ro(() => {
            if (n !== "vrrigs") return unsupported("GorillaParent." + n);
            const arr = Object.method("FindObjectsOfType").inflate(PhotonVRPlayerClass).invoke();
            return {
                method: (m: string) => ({
                    invoke: (i?: number) => (m === "get_Count" ? arr.length : arr.get(i)),
                }),
            };
        }),
    };

    const MonkeAgent: any = unsupported("MonkeAgent");
    const MonkeAgentInst: any = unsupported("MonkeAgent");
    const NetworkSystem: any = unsupported("NetworkSystem");
    const GameMode: any = unsupported("GameMode");
    const VRRig: any = unsupported("VRRig");
    const FriendshipGroupDetection: any = unsupported("FriendshipGroupDetection");
    const GorillaVelocityTracker: any = unsupported("GorillaVelocityTracker");
    const GorillaComputer: any = unsupported("GorillaComputer");
    const GorillaSurfaceOverride: any = unsupported("GorillaSurfaceOverride");
    // Menu buttons are hosted on the game's `kick` component (no Awake/Start/Update, so it's inert on our objects)
    const GorillaReportButton = AssemblyCSharp.class("kick");
    const PhotonNetwork = PhotonUnityNetworking.class("Photon.Pun.PhotonNetwork");
    const RpcTarget = PhotonUnityNetworking.class("Photon.Pun.RpcTarget");

    const GameObject = UnityEngineCore.class("UnityEngine.GameObject");
    const Object = UnityEngineCore.class("UnityEngine.Object");
    const SystemObject = Il2Cpp.corlib.class("System.Object");
    const Thread = Il2Cpp.corlib.class("System.Threading.Thread");
    const Vector3 = UnityEngineCore.class("UnityEngine.Vector3");
    const Quaternion = UnityEngineCore.class("UnityEngine.Quaternion");
    const Time = UnityEngineCore.class("UnityEngine.Time");
    const Resources = UnityEngineCore.class("UnityEngine.Resources");
    const Material = UnityEngineCore.class("UnityEngine.Material");
    const Renderer = UnityEngineCore.class("UnityEngine.Renderer");
    const Shader = UnityEngineCore.class("UnityEngine.Shader");
    const Color = UnityEngineCore.class("UnityEngine.Color");
    const RectTransform = UnityEngineCore.class("UnityEngine.RectTransform");
    const LineRenderer = UnityEngineCore.class("UnityEngine.LineRenderer");
    const PlayerPrefs = UnityEngineCore.class("UnityEngine.PlayerPrefs");

    const MeshCollider = UnityEnginePhysics.class("UnityEngine.MeshCollider");
    const BoxCollider = UnityEnginePhysics.class("UnityEngine.BoxCollider");
    const SphereCollider = UnityEnginePhysics.class("UnityEngine.SphereCollider");
    const CapsuleCollider = UnityEnginePhysics.class("UnityEngine.CapsuleCollider");
    const Collider = UnityEnginePhysics.class("UnityEngine.Collider");
    const Rigidbody = UnityEnginePhysics.class("UnityEngine.Rigidbody");
    const Physics = UnityEnginePhysics.class("UnityEngine.Physics");
    const Ray = UnityEngineCore.class("UnityEngine.Ray");
    const RaycastHit = UnityEnginePhysics.class("UnityEngine.RaycastHit");

    const Canvas = UnityEngineUIModule.class("UnityEngine.Canvas");
    const CanvasScaler = UnityEngineUI.class("UnityEngine.UI.CanvasScaler");
    const GraphicRaycaster = UnityEngineUI.class("UnityEngine.UI.GraphicRaycaster");
    const Text = UnityEngineUI.class("UnityEngine.UI.Text");
    const Font = UnityEngineTextRendering.class("UnityEngine.Font");

    const TextMeshPro = UnityTextMeshPro.class("TMPro.TextMeshPro");

    const RawImage = UnityEngineUI.class("UnityEngine.UI.RawImage");
    const Texture2D = UnityEngineCore.class("UnityEngine.Texture2D");
    const ByteClass = Il2Cpp.corlib.class("System.Byte");

    const rigidbody = GorillaTagger.field("<rigidbody>k__BackingField").value;


    let UberShader: any = null;
    for (const sn of ["GorillaTag/UberShader", "Universal Render Pipeline/Unlit", "Unlit/Color", "Sprites/Default", "GUI/Text Shader"]) {
        try { const sh = Shader.method("Find").invoke(Il2Cpp.string(sn)); if (sh && !sh.isNull()) { UberShader = sh; break; } } catch { }
    }
    const TextShader = Shader.method("Find").invoke(Il2Cpp.string("GUI/Text Shader"));


    const zeroVector = Vector3.field("zeroVector").value;
    const oneVector = Vector3.field("oneVector").value;
    const identityQuaternion = Quaternion.field("identityQuaternion").value;

    const leftHandTransform = GorillaTagger.field("leftHandTransform").value;
    const rightHandTransform = GorillaTagger.field("rightHandTransform").value;
    const headCollider = GorillaTagger.field("headCollider").value;
    const bodyCollider = GorillaTagger.field("bodyCollider").value;

    // Menu image configuration
    // Menu background image is temporarily removed. Paste the line from og-code.ts here to bring it back.
let MENU_IMAGE_BASE64: string = "PASTE_BASE64_IMAGE_HERE";

    let menuImageTexture = null;

    const punchLastLeft = [zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector];
    const punchLastRight = [zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector, zeroVector];

    let LPrev = Vector3.field("zeroVector").value;
    let RPrev = Vector3.field("zeroVector").value;
    let LVel = Vector3.field("zeroVector").value;
    let RVel = Vector3.field("zeroVector").value;
    let AvgVel = Vector3.field("zeroVector").value;

    let righthand = false;

    const arial = Resources
        .method("GetBuiltinResource", 1)
        .inflate(Font)
        .invoke(Il2Cpp.string("Arial.ttf"));

    function Destroy(object) {
        Object.method("Destroy", 1).invoke(object);
    }

    function getComponent(obj: any, type) {
        return obj.method("GetComponent", 1).inflate(type).invoke();
    }

    function getComponentInParent(obj: any, type) {
        return obj.method("GetComponentInParent", 0).inflate(type).invoke();
    }

    function addComponent(obj: any, type) {
        return obj.method("AddComponent", 1).inflate(type).invoke();
    }

    function getOrAddComponent(obj: any, type) {
        let returnType = getComponent(obj, type);
        if (returnType != null && returnType != undefined) {
            return returnType
        }
        return addComponent(obj, type);
    }

    function getObject(obj) {
        return GameObject.method("Find", 1).invoke(Il2Cpp.string(obj));
    }

    function playerIsLocal(player) {
        try { return player.method("get_photonView").invoke().method("get_IsMine").invoke(); } catch { return false; }
    }

    function setPlayerName(name) {
        PlayerPrefs.method("SetString").invoke(Il2Cpp.string("playerName"), Il2Cpp.string(name));
        PlayerPrefs.method("Save").invoke();
        try { VRManagerClass.method("SetUsername", 1).invoke(Il2Cpp.string(name)); } catch (e: any) { console.log("[port] SetUsername failed: " + e.message); }
        try { PhotonNetwork.method("get_LocalPlayer").invoke().method("set_NickName").invoke(Il2Cpp.string(name)); } catch { }
    }

    function setPlayerColor(color) {
        PlayerPrefs.method("SetFloat").invoke(Il2Cpp.string("redValue"), color[0]);
        PlayerPrefs.method("SetFloat").invoke(Il2Cpp.string("greenValue"), color[1]);
        PlayerPrefs.method("SetFloat").invoke(Il2Cpp.string("blueValue"), color[2]);
        PlayerPrefs.method("Save").invoke();
        try { VRManagerClass.method("SetColour", 1).invoke([color[0], color[1], color[2], 1.0]); } catch (e: any) { console.log("[port] SetColour failed: " + e.message); }
    }

    function becomePlayer(name: string, color: [number, number, number]) {
        setPlayerName(name);
        setPlayerColor(color);

        PlayerPrefs.method("SetFloat").invoke(Il2Cpp.string("opacity"), 0);
        PlayerPrefs.method("SetFloat").invoke(Il2Cpp.string("opacityValue"), 0);
        PlayerPrefs.method("SetFloat").invoke(Il2Cpp.string("transparency"), 0);
        PlayerPrefs.method("SetFloat").invoke(Il2Cpp.string("transparencyValue"), 0);

        PlayerPrefs.method("SetValue").invoke(Il2Cpp.string("playerColor"), color)
        PlayerPrefs.method("SetNumber").invoke(Il2Cpp.string("playerColor"), color)
        PlayerPrefs.method("SetFloat").invoke(Il2Cpp.string("playerColor"), color)
        PlayerPrefs.method("SetColor").invoke(Il2Cpp.string("playerColor"), color)

        PlayerPrefs.method("save").invoke();
        PlayerPrefs.method("Save").invoke();
        PlayerPrefs.method("saveValue").invoke();
        PlayerPrefs.method("SaveValue").invoke();
    }

    function getTransform(obj: any) {
        return obj.method("get_transform").invoke();
    }

    function world2Player(position) {
        position = Vector3.method("op_Subtraction", 2).invoke(position, getTransform(bodyCollider).method("get_position").invoke());
        position = Vector3.method("op_Addition", 2).invoke(position, getTransform(GorillaTagger).method("get_position").invoke());
        return position;
    }

    function teleportPlayer(position) {
        getTransform(GTPlayer).method("set_position").invoke(world2Player(position));
        try { GTPlayer.field("playerRigidBody").value.method("set_velocity").invoke(Vector3.field("zeroVector").value); } catch { }
    }

    function sendAllOutgoing() {
        MonkeAgentInst.field("rpcErrorMax").value = Number.MAX_SAFE_INTEGER;
        MonkeAgentInst.field("rpcCallLimit").value = Number.MAX_SAFE_INTEGER;
        MonkeAgentInst.field("logErrorMax").value = Number.MAX_SAFE_INTEGER;
        PhotonNetwork.method("set_MaxResendsBeforeDisconnect").invoke(Number.MAX_SAFE_INTEGER);
        PhotonNetwork.method("set_QuickResends").invoke(Number.MAX_SAFE_INTEGER);
        PhotonNetwork.method("SendAllOutgoingCommands").invoke();
    }

    function serialize() {
        PhotonNetwork.method("RunViewUpdate").invoke();
    }

    function renderMenuText(
        canvasObject,
        text: string = "",
        color: [number, number, number, number] = [1, 1, 1, 1],
        pos = zeroVector,
        size = oneVector
    ) {
        const holder = createObject(zeroVector, identityQuaternion, oneVector, 3, [0, 0, 0, 0], getTransform(canvasObject));
        try { Destroy(getComponent(holder, BoxCollider)); } catch { }
        const title = addComponent(holder, Text);
        title.method("set_text").invoke(Il2Cpp.string(text));
        title.method("set_font").invoke(arial);
        title.method("set_fontSize").invoke(1);
        title.method("set_color").invoke(color);
        title.method("set_fontStyle").invoke(2);
        title.method("set_alignment").invoke(4);
        title.method("set_resizeTextForBestFit").invoke(true);
        title.method("set_resizeTextMinSize").invoke(0);

        const rectTransform = getComponent(title, RectTransform);
        rectTransform.method("set_sizeDelta").invoke(size);
        rectTransform.method("set_position").invoke(pos);
        rectTransform.method("set_rotation").invoke(Quaternion.method("Euler").invoke(180.0, 90.0, 90.0))
    }

    function createMaterial(shader) {
        const material = Material.new();
        return Material.method("CreateWithShader").invoke(material, shader);
    }

    function createObject(
        pos = zeroVector,
        rot = identityQuaternion,
        scale = oneVector,
        primitiveType: number = 3,
        colorArr: [number, number, number, number] = [1, 1, 1, 1],
        parent = null
    ) {
        const obj = GameObject.method("CreatePrimitive").invoke(primitiveType);

        const renderer = getComponent(obj, Renderer);

        if (colorArr[3] == 0) {
            renderer.method("set_enabled").invoke(false);
        } else {
            const material = renderer.method("get_material").invoke(); material.method("set_shader").invoke(UberShader); material.method("set_color").invoke(colorArr);
        }

        const transform = getTransform(obj);
        if (parent != null) {
            transform.method("SetParent", 2).invoke(parent, false);
        }

        transform.method("set_position").invoke(pos);
        transform.method("set_rotation").invoke(rot);
        transform.method("set_localScale").invoke(scale);

        return obj;
    }

    // Convert an embedded Base64 image into a byte array.
function base64ToBytes(base64: string): number[] {
    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    const clean = base64.replace(/[^A-Za-z0-9+/]/g, "");
    const bytes: number[] = [];

    let buffer = 0;
    let bits = 0;

    for (let i = 0; i < clean.length; i++) {
        const value = alphabet.indexOf(clean[i]);

        if (value < 0) continue;

        buffer = (buffer << 6) | value;
        bits += 6;

        if (bits >= 8) {
            bits -= 8;
            bytes.push((buffer >> bits) & 0xFF);
            buffer &= (1 << bits) - 1;
        }
    }

    return bytes;
}


// Load and cache the menu texture.
const MENU_IMAGE_RAW_SIZE = 160;
let menuImageFailed = false;

function getMenuImageTexture() {
    if (menuImageTexture != null) {
        return menuImageTexture;
    }

    const bytes = base64ToBytes(MENU_IMAGE_BASE64);
    const texture = Texture2D.new();
    texture.method(".ctor", 4).invoke(MENU_IMAGE_RAW_SIZE, MENU_IMAGE_RAW_SIZE, 4, false); // 4 = TextureFormat.RGBA32

    const mem = Memory.alloc(bytes.length);
    mem.writeByteArray(new Uint8Array(bytes).buffer);
    texture.method("LoadRawTextureData", 2).invoke(mem, bytes.length);
    texture.method("Apply", 0).invoke();

    texture.method("set_filterMode").invoke(1);
    texture.method("set_wrapMode").invoke(1);

    menuImageTexture = texture;

    return menuImageTexture;
}


// Create a decorative image on the menu Canvas.
// This is a RawImage, NOT a button.
function addMenuImage(canvasObject: any) {
    try {
        if (
            !MENU_IMAGE_BASE64 ||
            (MENU_IMAGE_BASE64 as string) === "PASTE_BASE64_IMAGE_HERE"
        ) {
            return;
        }

        if (menuImageFailed) return;
        const texture = getMenuImageTexture();

        // Create an invisible GameObject underneath the Canvas.
        const imageObject = createObject(
            zeroVector,
            identityQuaternion,
            oneVector,
            3,
            [0, 0, 0, 0],
            getTransform(canvasObject)
        );

        imageObject.method("set_name").invoke(
            Il2Cpp.string("Menu_DecorativeImage")
        );

        // Remove the primitive collider.
        const collider = getComponent(imageObject, BoxCollider);

        if (collider != null) {
            Destroy(collider);
        }

        // Add the actual UI image component.
        const image = addComponent(imageObject, RawImage);

        image.method("set_texture").invoke(texture);
        image.method("set_color").invoke([1, 1, 1, 1]);

        // Make sure the image cannot intercept UI interactions.
        image.method("set_raycastTarget").invoke(false);

        const rectTransform = getComponent(image, RectTransform);

        // Image dimensions.
        rectTransform.method("set_sizeDelta").invoke([0.16, 0.09]);

        // Image position.
        rectTransform.method("set_position").invoke([
            0.11,
            0.24,
            0.175
        ]);

        rectTransform.method("set_rotation").invoke(
            Quaternion.method("Euler").invoke(180.0, 90.0, 90.0)
        );

    }
    catch (error) {
        if (!menuImageFailed) { menuImageFailed = true; console.log("[Menu] Image skipped: " + error); }
    }
}

    function sendNotification(NotificationText: string = "", requiresReload: boolean = true, clearTime: number = 5) {
        const isOld = (currentNotification == NotificationText);
        notifactionResetTime = time + clearTime;
        currentNotification = NotificationText;
        if (NotificationText && !isOld && NotificationText.indexOf("ENABLE</color>") < 0 && NotificationText.indexOf("DISABLE</color>") < 0)
            hudPush(NotificationText, clearTime);
        if (requiresReload && !isOld)
            reloadMenu();
    }

    let menuFailT = 0;
    function renderMenu() {
        if (time < menuFailT) return;
        try {
            if (!pcFlag.mLog1) { pcFlag.mLog1 = true; console.log("[pc] building menu (first open)..."); }
            renderMenuCore();
            if (!pcFlag.mLog2) { pcFlag.mLog2 = true; console.log("[pc] menu built OK"); }
        }
        catch (e: any) {
            pcLog("renderMenu", e);
            try { if (menu != null) Object.method("Destroy", 1).invoke(menu); } catch { }
            menu = null; menuFailT = time + 3;
        }
    }
    function renderMenuCore() {
        menu = createObject(zeroVector, identityQuaternion, [0.1, 0.3, 0.3825], 3, [0, 0, 0, 0]);
        Destroy(getComponent(menu, BoxCollider))

        const menuBackground = createObject([0.1, 0, 0], identityQuaternion, [0.1, 1, 1], 3, bgColor, getTransform(menu))
        Destroy(getComponent(menuBackground, BoxCollider))

        const canvasObject = createObject(zeroVector, identityQuaternion, oneVector, 3, [0, 0, 0, 0], getTransform(menu));
        const canvas = addComponent(canvasObject, Canvas);
        Destroy(getComponent(canvasObject, BoxCollider))

        const canvasScaler = addComponent(canvasObject, CanvasScaler);
        addComponent(canvasObject, GraphicRaycaster);
        canvas.method("set_renderMode").invoke(2);
        canvasScaler.method("set_dynamicPixelsPerUnit").invoke(1000.0);

        // NEW!
        // Add the decorative menu image.
        addMenuImage(canvasObject);

        renderMenuText(canvasObject, menuName + " " + `<color=grey>[</color><color=white>${currentPage + 1}</color><color=grey>]</color>`, textColor, [0.11, 0, 0.175], [1, 0.1]);

        if (time > notifactionResetTime)
            currentNotification = "";
        renderMenuText(canvasObject, currentNotification, textColor, [0.11, 0, 0.275], [1, 0.1]);

        const disconnectButton = createObject([0.1, 0.0, 0.225], identityQuaternion, [0.09, 0.9, 0.08], 3, buttonColor, getTransform(menu));
        disconnectButton.method("set_name").invoke(Il2Cpp.string("@Disconnect"));

        addComponent(disconnectButton, GorillaReportButton);
        getComponent(disconnectButton, BoxCollider).method("set_isTrigger").invoke(true);
        renderMenuText(canvasObject, "Disconnect", textColor, [0.11, 0, 0.225], [1, 0.1]);

        const returnButton = createObject([0.1, -0.175, -0.225], identityQuaternion, [0.09, 0.09, 0.09], 3, buttonColor, getTransform(menu));
        returnButton.method("set_name").invoke(Il2Cpp.string("@GlobalReturn"));

        addComponent(returnButton, GorillaReportButton);
        getComponent(returnButton, BoxCollider).method("set_isTrigger").invoke(true);
        renderMenuText(canvasObject, "<", textColor, [0.11, -0.175, -0.225], [1, 0.1]);

        {
            const pageButton = createObject([0.1, 0.2, 0], identityQuaternion, [0.09, 0.2, 0.9], 3, buttonColor, getTransform(menu));
            pageButton.method("set_name").invoke(Il2Cpp.string("@PreviousPage"));

            addComponent(pageButton, GorillaReportButton);
            getComponent(pageButton, BoxCollider).method("set_isTrigger").invoke(true);
            renderMenuText(canvasObject, "<", textColor, [0.11, 0.2, 0], [1, 0.1]);
        }

        {
            const pageButton = createObject([0.1, -0.2, 0], identityQuaternion, [0.09, 0.2, 0.9], 3, buttonColor, getTransform(menu));
            pageButton.method("set_name").invoke(Il2Cpp.string("@NextPage"));

            addComponent(pageButton, GorillaReportButton);
            getComponent(pageButton, BoxCollider).method("set_isTrigger").invoke(true);
            renderMenuText(canvasObject, ">", textColor, [0.11, -0.2, 0], [1, 0.1]);
        }

        let i = 0;
        const targetMods = buttons[currentCategory]
            .slice(currentPage * 8)
            .slice(0, 8);
        
        const favorited = [];
        buttons[11].forEach((buttonData) => {
            if (buttonData.buttonText != "Exit Favorite Mods")
                favorited.push(buttonData.buttonText);
        });
        const favTextColor: [number, number, number, number] = [
            Math.max( Math.min(textColor[0] + (favoriteColor == 0 ? (+1.0) : 0.2), 1), 0 ),
            Math.max( Math.min(textColor[1] + (favoriteColor == 1 ? (-0.1) : (favoriteColor == 0 ? (-0.1) : 0.2)), 1), 0 ),
            Math.max( Math.min(textColor[2] + (favoriteColor == 2 ? (-0.1) : (favoriteColor == 0 ? (-0.2) : 0.2)), 1), 0 ),
            Math.max( Math.min(textColor[3] + (favoriteColor == 3 ? (-0.7) : 0.0), 1), 0 )
        ]
        
        targetMods.forEach((buttonData, index) => {
            const button = createObject([0.105, 0, 0.13 - (i * 0.04)], identityQuaternion, [0.09, 0.9, 0.08], 3, buttonColor, getTransform(menu));
            button.method("set_name").invoke(Il2Cpp.string("@" + buttonData.buttonText));

            addComponent(button, GorillaReportButton);
            getComponent(button, BoxCollider).method("set_isTrigger").invoke(true);
            renderMenuText(canvasObject, buttonData.buttonText, favorited.includes(buttonData.buttonText) ? favTextColor : textColor, [0.11, 0, 0.13 - (i * 0.04)], [1, 0.1]);
            updateButtonColor(button, buttonData);
            i++;
        });
        getTransform(menu).method("set_localScale").invoke(Vector3.method("op_Multiply").invoke(Vector3.method("op_Multiply").invoke(getTransform(menu).method("get_localScale").invoke(), GTPlayer.field("nativeScale").value), menuscale));
        recenterMenu();
    }

    function renderReference() {
        if (righthand) {
            reference = createObject(zeroVector, identityQuaternion, [0.01, 0.01, 0.01], 0, bgColor, leftHandTransform)
            referenceCollider = getComponent(reference, Collider); try { referenceCollider.method("set_isTrigger").invoke(true); } catch { }

            getTransform(reference).method("set_localPosition").invoke([0.01, -0.117, 0.05]);
            reference.method("set_layer").invoke(2);
            addComponent(reference, Rigidbody).method("set_isKinematic").invoke(true);
        }
        else {
            reference = createObject(zeroVector, identityQuaternion, [0.01, 0.01, 0.01], 0, bgColor, rightHandTransform)
            referenceCollider = getComponent(reference, Collider); try { referenceCollider.method("set_isTrigger").invoke(true); } catch { }

            getTransform(reference).method("set_localPosition").invoke([0.01, -0.117, 0.05]);
            reference.method("set_layer").invoke(2);
            addComponent(reference, Rigidbody).method("set_isKinematic").invoke(true);
        }
    }
    
    function toggleFavorite(info: ButtonInfo) {
        let exists = false;
        for (let index = 0; index < buttons[11].length; index++) {
            const mod = buttons[11][index];
            if (mod.buttonText == info.buttonText)
            {
                exists = true;
                break;
            }
        }
        if (exists) {
            if (info.buttonText == "Exit Favorite Mods")
                return;
            for (let index = 0; index < buttons[11].length; index++) {
                const mod = buttons[11][index];
                if (mod.buttonText == info.buttonText)
                {
                    buttons[11].splice(index, 1);
                    break;
                }
            }
        } else {
            if (info.buttonText == "Exit Favorite Mods")
                return;
            buttons[11].push(info);
        }
    }
    function loadEnabled() {
        buttons[12].splice(1);
        buttons.forEach((buttonList, index) => {
            if (index != 12 && index != 11) {
                buttonList.forEach(button => {
                    if (button.enabled)
                        buttons[12].push(button);
                });
            }
        });
    }

    let gunLocked = false;
    let lockTarget = null;
    let GunPointer = null;
    let GunLine = null;
    function renderGun(overrideLayerMask = null) {
        const StartPosition = rightHandTransform.method("get_position").invoke();
        const Direction = rightHandTransform.method("get_forward").invoke();

        const DirectionDivided = Vector3.method("op_Division").invoke(Direction, 4);
        const rayStartPosition = Vector3.method("op_Addition").invoke(StartPosition, DirectionDivided);

        const layerMask = overrideLayerMask || -1;

        const hits = Physics.method("RaycastAll", 4).invoke(
            rayStartPosition,
            Direction,
            512.0,
            layerMask
        );

        let finalDistance = Infinity;
        let finalRay = null;
        for (const hit of hits) {
            const distance = Vector3.method("Distance").invoke(hit.method("get_point").invoke(), StartPosition);
            if (distance < finalDistance) {
                finalRay = hit;
                finalDistance = distance;
            }
        }

        let EndPosition;
        if (gunLocked) {
            EndPosition = getTransform(lockTarget).method("get_position").invoke();
        } else if (finalRay != null) {
            EndPosition = finalRay.method("get_point").invoke();
        } else {
            EndPosition = zeroVector;
        }

        if (Vector3.method("op_Equality").invoke(EndPosition, zeroVector)) {
            const farDirection = Vector3.method("op_Multiply").invoke(Direction, 512);
            EndPosition = Vector3.method("op_Addition").invoke(StartPosition, farDirection);
        }

        if (GunPointer == null) {
            GunPointer = createObject(EndPosition, identityQuaternion, [0.1, 0.1, 0.1], 0, [1, 1, 1, 1]);
        }

        GunPointer.method("SetActive").invoke(true);
        const pointerTransform = getTransform(GunPointer);
        pointerTransform.method("set_position").invoke(EndPosition);

        const PointerRenderer = getComponent(GunPointer, Renderer);
        const material = PointerRenderer.method("get_material").invoke();

        material.method("set_shader").invoke(TextShader);

        const pointerColor = (gunLocked || rightTrigger) ? buttonPressedColor : buttonColor;
        material.method("set_color").invoke(pointerColor);

        const collider = getComponent(GunPointer, Collider);
        if (collider != null) {
            Destroy(collider);
        }

        if (GunLine == null) {
            const lineObj = createObject(zeroVector, identityQuaternion, oneVector, 0, [0, 0, 0, 0]);
            GunLine = addComponent(lineObj, LineRenderer);
        } else {
            GunLine.method("get_gameObject").invoke().method("SetActive").invoke(true);
        }

        const lineMaterial = GunLine.method("get_material").invoke();
        lineMaterial.method("set_shader").invoke(TextShader);

        GunLine.method("set_startColor").invoke(bgColor);
        GunLine.method("set_endColor").invoke(bgColor);

        const lineWidth = 0.025;
        GunLine.method("set_startWidth").invoke(lineWidth);
        GunLine.method("set_endWidth").invoke(lineWidth);

        GunLine.method("set_positionCount").invoke(2);
        GunLine.method("set_useWorldSpace").invoke(true);

        GunLine.method("set_numCapVertices").invoke(10);

        GunLine.method("SetPosition").invoke(0, StartPosition);
        GunLine.method("SetPosition").invoke(1, EndPosition);

        if (rightTrigger || gunLocked) {
            const Step = 10;
            GunLine.method("set_positionCount").invoke(Step);
            GunLine.method("SetPosition").invoke(0, StartPosition);

            for (let i = 1; i < (Step - 1); i++) {
                const t = i / (Step - 1);
                const Position = Vector3.method("Lerp").invoke(StartPosition, EndPosition, t);

                const randomValue = Math.random();
                let offset = zeroVector;

                if (randomValue > 0.75) {
                    offset = [
                        (Math.random() * 0.2) - 0.1,
                        (Math.random() * 0.2) - 0.1,
                        (Math.random() * 0.2) - 0.1
                    ];
                }

                const finalPosition = Vector3.method("op_Addition").invoke(Position, offset);
                GunLine.method("SetPosition").invoke(i, finalPosition);
            }

            GunLine.method("SetPosition").invoke(Step - 1, EndPosition);
        }

        return { ray: finalRay, gunPointer: GunPointer };
    }

    function recenterMenu() {
        const menuTransform = getTransform(menu);
        let targetPos, targetRot;

        if (righthand) {
            targetPos = rightHandTransform.method("get_position").invoke();
            targetRot = rightHandTransform.method("get_rotation").invoke();
            targetRot = Quaternion.method("op_Multiply").invoke(targetRot, Quaternion.method("Euler").invoke(0, 0, 180));
        } else {
            targetPos = leftHandTransform.method("get_position").invoke();
            targetRot = leftHandTransform.method("get_rotation").invoke();
            targetRot = Quaternion.method("op_Multiply").invoke(targetRot, Quaternion.method("Euler").invoke(0, 0, 0));
        }

        if (LerpMenu) {
            const menuPos = menuTransform.method("get_position").invoke();
            const distance = Vector3.method("Distance").invoke(menuPos, zeroVector);
            if (distance < 1) {
                menuTransform.method("set_position").invoke(targetPos);
                menuTransform.method("set_rotation").invoke(targetRot);
            } else {
                const newPos = Vector3.method("Lerp").invoke(menuPos, targetPos, deltaTime * 15);
                menuTransform.method("set_position").invoke(newPos);
                const newRot = Quaternion.method("Slerp").invoke(menuTransform.method("get_rotation").invoke(), targetRot, deltaTime * 15);
                menuTransform.method("set_rotation").invoke(newRot);
            }
        } else {
            menuTransform.method("set_position").invoke(targetPos);
            menuTransform.method("set_rotation").invoke(targetRot);
        }
    }

    function reloadMenu() {
        if (menu != null) {
            Object.method("Destroy", 1).invoke(menu);
            menu = null;
        }
    }

    function updateButtonColor(button, buttonData) {
        const RendererClass = Il2Cpp.domain
            .assembly("UnityEngine.CoreModule")
            .image
            .class("UnityEngine.Renderer");

        const renderer = getComponent(button, RendererClass);
        if (!renderer) {
            return;
        }

        const material = renderer.method("get_material").invoke();
        material.method("set_color").invoke(buttonData.enabled ? buttonPressedColor : buttonColor);
    }

    function playButtonSound() {
        try {
            EasyInputsClass.method("Vibration").invoke(righthand ? HAND_R : HAND_L, 0.5, 0.075);
        } catch { }
    }

    function toggleColliders(enabled) {
        const meshColliders = Object.method("FindObjectsOfType").inflate(MeshCollider).invoke();

        for (let i = 0; i < meshColliders.length; i++) {
            const meshCollider = meshColliders.get(i);
            meshCollider.method("set_enabled").invoke(enabled);
        }
    }

    interface ButtonInfoConfig {
        buttonText: string;
        method?: () => void;
        enableMethod?: () => void;
        disableMethod?: () => void;
        isTogglable?: boolean;
        toolTip?: string;
        enabled?: boolean;
    }

    class ButtonInfo {
        buttonText: string;
        method?: () => void;
        enableMethod?: () => void;
        disableMethod?: () => void;
        isTogglable: boolean;
        toolTip?: string;
        enabled: boolean;

        constructor(config: ButtonInfoConfig) {
            this.buttonText = config.buttonText;
            this.method = config.method;
            this.enableMethod = config.enableMethod;
            this.disableMethod = config.disableMethod;
            this.isTogglable = config.isTogglable ?? true;
            this.toolTip = config.toolTip ?? null;
            this.enabled = config.enabled ?? false;
        }
    }

    let currentCategory = 0;
    let currentPage = 0;

    const buttons: ButtonInfo[][] = [
        [ // Main [0]
            new ButtonInfo({
                buttonText: "Settings",
                method: () => { currentCategory = 2; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the settings category."
            }),
            new ButtonInfo({
                buttonText: "Favorite Mods",
                method: () => { currentCategory = 11; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens your favorite mods."
            }),
            new ButtonInfo({
                buttonText: "Enabled Mods",
                method: () => { currentCategory = 12; currentPage = 0; loadEnabled() },
                isTogglable: false,
                toolTip: "Opens your enabled mods."
            }),
            new ButtonInfo({
                buttonText: "Movement Mods",
                method: () => { currentCategory = 3; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the movement category."
            }),
            new ButtonInfo({
                buttonText: "Fun Mods",
                method: () => { currentCategory = 4; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the fun category."
            }),
            new ButtonInfo({
                buttonText: "Advantage Mods",
                method: () => { currentCategory = 5; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the advantage category."
            }),
            new ButtonInfo({
                buttonText: "Rig Mods",
                method: () => { currentCategory = 6; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the rig category."
            }),
            new ButtonInfo({
                buttonText: "Misc Mods",
                method: () => { currentCategory = 7; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the misc category."
            }),
            new ButtonInfo({
                buttonText: "Visual Mods",
                method: () => { currentCategory = 8; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the visual category."
            }),
            new ButtonInfo({
                buttonText: "Overpowered Mods",
                method: () => { currentCategory = 9; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the op category."
            }),
            new ButtonInfo({
                buttonText: "Safety Mods",
                method: () => { currentCategory = 10; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the safety category."
            }),
            new ButtonInfo({
                buttonText: "Credits",
                method: () => { currentCategory = 13; currentPage = 0 },
                isTogglable: false,
                toolTip: "Opens the credits."
            }),
        ],

        [ // Hidden [1]
            new ButtonInfo({
                buttonText: "Disconnect",
                method: () => {
                    try { 
                        NetworkSystem.method("ReturnToSinglePlayer").invoke(); 
                    } catch { 
                        PhotonNetwork.method("Disconnect").invoke(); // In the case of it not having NetworkSystem like being an old copy it will use the old disconnect method as a fallback
                    }
                },
                isTogglable: false,
                toolTip: "Disconnects you from the room."
            }),
            new ButtonInfo({
                buttonText: "PreviousPage",
                method: () => {
                    const lastPage = Math.ceil(buttons[currentCategory].length / 8) - 1;

                    currentPage--;
                    if (currentPage < 0)
                        currentPage = lastPage;
                },
                isTogglable: false
            }),
            new ButtonInfo({
                buttonText: "NextPage",
                method: () => {
                    const lastPage = Math.ceil(buttons[currentCategory].length / 8) - 1;

                    currentPage++;
                    currentPage %= lastPage + 1;
                },
                isTogglable: false
            }),
            new ButtonInfo({
                buttonText: "GlobalReturn",
                method: () => {
                    currentCategory = 0;
                    currentPage = 0;
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            })
        ],

        [ // Settings [2]
            new ButtonInfo({
                buttonText: "Exit Settings",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            new ButtonInfo({
                buttonText: "Image as Background",
                enabled: false, // may change in the future
                method: () => imageAsBackground = true,
                disableMethod: () => imageAsBackground = false,
                toolTip: "Applies a image to the menu\'s background when on, Reverts to a normal menu when off."
            }),
            new ButtonInfo({
                buttonText: "Change Menu Theme",
                method: () => {
                    themeIndex++;
                    themeIndex %= 12;
                    
                    switch (themeIndex) {
                        case 0:
                            bgColor = [0.969, 0.902, 0.157, 1.0];
                            textColor = [1.0, 1.0, 1.0, 1.0];

                            buttonColor = [0.0, 0.0, 0.0, 1.0];
                            buttonPressedColor = [0.140, 0.140, 0.140, 1.0];
                            break;
                        case 1:
                            bgColor = [1.0, 0.5, 0.0, 1.0];
                            textColor = [1.0, 0.7450981, 0.4901961, 1.0];

                            buttonColor = [0.666, 0.333, 0.0, 1.0];
                            buttonPressedColor = [0.333, 0.150, 0.0, 1.0];
                            break;
                        case 2:
                            bgColor = [1.0, 0.0, 0.0, 1.0];
                            textColor = [1.0, 1.0, 1.0, 1.0];

                            buttonColor = [0.0, 0.0, 0.0, 1.0];
                            buttonPressedColor = [1.0, 0.0, 0.0, 1.0];
                            break;
                        case 3:
                            bgColor = [0.0, 1.0, 0.0, 1.0];
                            textColor = [1.0, 1.0, 1.0, 1.0];

                            buttonColor = [0.0, 0.0, 0.0, 1.0];
                            buttonPressedColor = [0.0, 1.0, 0.0, 1.0];
                            break;
                        case 4:
                            bgColor = [0.0, 0.0, 1.0, 1.0];
                            textColor = [1.0, 1.0, 1.0, 1.0];

                            buttonColor = [0.0, 0.0, 0.0, 1.0];
                            buttonPressedColor = [0.0, 0.0, 1.0, 1.0];
                            break;
                        case 5:
                            bgColor = [0.5, 0.0, 0.5, 1.0];
                            textColor = [1.0, 0.9, 1.0, 1.0];

                            buttonColor = [0.25, 0.0, 0.25, 1.0];
                            buttonPressedColor = [0.7, 0.0, 0.7, 1.0];
                            break;
                        case 6:
                            bgColor = [0.0, 0.7, 0.7, 1.0];
                            textColor = [1.0, 0.2, 0.8, 1.0];

                            buttonColor = [0.0, 0.3, 0.3, 1.0];
                            buttonPressedColor = [1.0, 0.0, 0.7, 1.0];
                            break;
                        case 7:
                            bgColor = [0.9, 0.7, 0.1, 1.0];
                            textColor = [0.0, 0.0, 0.0, 1.0];

                            buttonColor = [0.2, 0.2, 0.2, 1.0];
                            buttonPressedColor = [1.0, 0.84, 0.0, 1.0];
                            break;
                        case 8:
                            bgColor = [0.7, 0.9, 1.0, 1.0];
                            textColor = [0.1, 0.2, 0.4, 1.0];

                            buttonColor = [0.5, 0.7, 0.9, 1.0];
                            buttonPressedColor = [0.2, 0.4, 0.8, 1.0];
                            break;
                        case 9:
                            bgColor = [0.6, 0.0, 0.0, 1.0];
                            textColor = [1.0, 0.7, 0.2, 1.0];

                            buttonColor = [0.2, 0.0, 0.0, 1.0];
                            buttonPressedColor = [1.0, 0.3, 0.0, 1.0];
                            break;
                        case 10:
                            bgColor = [0.05, 0.05, 0.1, 1.0];
                            textColor = [0.6, 0.8, 1.0, 1.0];

                            buttonColor = [0.1, 0.1, 0.2, 1.0];
                            buttonPressedColor = [0.4, 0.6, 1.0, 1.0];
                            break;
                        case 11:
                            bgColor = [0.125, 0.125, 0.125, 1.0];
                            textColor = [1.0, 1.0, 0.9, 1.0];

                            buttonColor = [0.111, 0.111, 0.222, 1.0];
                            buttonPressedColor = [0.111, 0.111, 0.67, 1.0];
                            break;
                    }
                },
                isTogglable: false,
                toolTip: "Changes the theme of the menu."
            }),
            new ButtonInfo({
                buttonText: "Change Button Sound",
                method: () => {
                    function getRandomFloat(min: number, max: number): number {
                        return Math.random() * (max - min) + min;
                    }

                    buttonIndex++;
                    buttonIndex %= 7;

                    switch (buttonIndex) {
                        case 0:
                            buttonSound = 8;
                            break;
                        case 1:
                            buttonSound = 66;
                            break;
                        case 2:
                            buttonSound = 67;
                            break;
                        case 3:
                            buttonSound = 84;
                            break;
                        case 4:
                            buttonSound = 106;
                            break;
                        case 5:
                            buttonSound = 189;
                            break;
                        case 6:
                            sendNotification("RANDOM SOUNDS HAS BEEN ACTIVATED")
                            buttonSound = getRandomFloat(0, 300);
                            break;
                    }
                },
                isTogglable: false,
                toolTip: "Changes the button sound."
            }),
            new ButtonInfo({
                buttonText: "Random Button Sound (BUTTON)",
                method: () => {
                    function getRandomFloat(min: number, max: number): number {
                        return Math.random() * (max - min) + min;
                    }
                    
                    buttonSound = getRandomFloat(0, 300);
                },
                isTogglable: false,
                toolTip: "Randomises the button sound."
            }),
            new ButtonInfo({
                buttonText: "Random Button Sound (Toggle)",
                method: () => {
                    function getRandomFloat(min: number, max: number): number {
                        return Math.random() * (max - min) + min;
                    }
                    
                    buttonSound = getRandomFloat(0, 300);
                },
                isTogglable: true,
                toolTip: "Constantly randomises the button sound."
            }),
            new ButtonInfo({
                buttonText: "Change Favorite Color",
                method: () => {
                    favoriteColor++;
                    favoriteColor %= 4;
                },
                isTogglable: false,
                toolTip: "Changes the text color of favorite mods."
            }),
            new ButtonInfo({
                buttonText: "Change Menu Scale",
                method: () => {
                    menuscale += 0.1;
                    if (menuscale > 1.5) {
                        menuscale = 0.3;
                    }
                },
                isTogglable: false,
                toolTip: "Changes the button sound."
            }),
            // ill fix these myself with my other old menu's code and ill add styles
            /*
            new ButtonInfo({
                buttonText: "No GunLine",
                method: () => {
                    GunLine = [0, 0, 0, 0];
                },
                isTogglable: true,
                toolTip: "Disables The GunLine."
            }),
            new ButtonInfo({
                buttonText: "No GunPointer",
                method: () => {
                    GunPointer = [0, 0, 0, 0];
                },
                isTogglable: true,
                toolTip: "Disables The GunPointer."
            }),
            new ButtonInfo({
                buttonText: "No Menu Background",
                method: () => {
                    bgColor = [1.0, 0.5, 0.0, 0.0];
                },
                disableMethod: () => {
                    bgColor = [1.0, 0.5, 0.0, 1.0];
                },
                isTogglable: true,
                toolTip: "Disables The Menu Background."
            }),
            */
            new ButtonInfo({
                buttonText: "Freeze Player in Menu",
                enabled: true,
                method: () => {
                    if (menu != null) {
                        if (closePosition == null) {
                            closePosition = getTransform(rigidbody).method("get_position").invoke();
                        }
                        else {
                            getTransform(rigidbody).method("set_position").invoke(closePosition);
                            rigidbody.method("set_velocity").invoke(zeroVector);
                        }
                    } else {
                        closePosition = null;
                    }
                },
                toolTip: "Freezes your character while in the menu."
            }),
            new ButtonInfo({
                buttonText: "Button Notifications",
                enabled: true,
                method: () => buttonNotifications = true,
                disableMethod: () => buttonNotifications = false,
                toolTip: "Shows notifications when clicking menu buttons, may cause lag."
            }),
            new ButtonInfo({
                buttonText: "Enabled Recent",
                method: () => enabledRecent = true,
                disableMethod: () => enabledRecent = false,
                toolTip: "Shows recently disabled mods in enabled mods."
            }),
            new ButtonInfo({
                buttonText: "Right Hand",
                method: () => righthand = true,
                disableMethod: () => righthand = false,
                toolTip: "Lets you switch menu hand."
            }),
            new ButtonInfo({
                buttonText: "Lerp Menu",
                method: () => LerpMenu = true,
                disableMethod: () => LerpMenu = false,
                toolTip: "Makes the menu Lerped."
            }),
            new ButtonInfo({
                buttonText: "High Punch Power",
                enableMethod: () => highPunchPower = true,
                disableMethod: () => highPunchPower = false,
                toolTip: "Makes punch mod more powerful."
            }),
            new ButtonInfo({
                buttonText: "ESP Collisions",
                enableMethod: () => {
                    for (let line of linePool) {
                        Destroy(line.method("get_gameObject").invoke());
                    }
                    linePool = [];
                    espCollide = true
                },
                disableMethod: () => {
                    for (let line of linePool) {
                        Destroy(line.method("get_gameObject").invoke());
                    }
                    linePool = [];
                    espCollide = false
                },
                toolTip: "Makes ESP have collisions."
            }),
        ],

        [ // Movement Mods [3]
            new ButtonInfo({
                buttonText: "Exit Movement Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),

            new ButtonInfo({
                buttonText: "Platforms",
                method: () => {
                    if (leftGrab) {
                        if (leftPlatform == null) {
                            const handTransform = leftHandTransform;
                            leftPlatform = createObject(handTransform.method("get_position").invoke(), handTransform.method("get_rotation").invoke(), [0.025, 0.15, 0.2], 3, bgColor);
                        }
                    } else {
                        if (leftPlatform != null) {
                            Destroy(leftPlatform);
                            leftPlatform = null;
                        }
                    }

                    if (rightGrab) {
                        if (rightPlatform == null) {
                            const handTransform = rightHandTransform;
                            rightPlatform = createObject(handTransform.method("get_position").invoke(), handTransform.method("get_rotation").invoke(), [0.025, 0.15, 0.2], 3, bgColor);
                        }
                    } else {
                        if (rightPlatform != null) {
                            Destroy(rightPlatform);
                            rightPlatform = null;
                        }
                    }
                },
                toolTip: "Spawns platforms when pressing grip."
            }),

            new ButtonInfo({
                buttonText: "Trigger Platforms",
                method: () => {
                    if (leftTrigger) {
                        if (leftPlatform == null) {
                            const handTransform = leftHandTransform;
                            leftPlatform = createObject(handTransform.method("get_position").invoke(), handTransform.method("get_rotation").invoke(), [0.025, 0.15, 0.2], 3, bgColor);
                        }
                    } else {
                        if (leftPlatform != null) {
                            Destroy(leftPlatform);
                            leftPlatform = null;
                        }
                    }

                    if (rightTrigger) {
                        if (rightPlatform == null) {
                            const handTransform = rightHandTransform;
                            rightPlatform = createObject(handTransform.method("get_position").invoke(), handTransform.method("get_rotation").invoke(), [0.025, 0.15, 0.2], 3, bgColor);
                        }
                    } else {
                        if (rightPlatform != null) {
                            Destroy(rightPlatform);
                            rightPlatform = null;
                        }
                    }
                },
                toolTip: "Spawns platforms when pressing trigger."
            }),

            new ButtonInfo({
                buttonText: "Frozone",
                method: () => {
                    if (leftGrab) {
                        //if (leftPlatform == null) {
                            const handTransform = leftHandTransform;
                            leftPlatform = createObject(handTransform.method("get_position").invoke(), handTransform.method("get_rotation").invoke(), [0.025, 0.15, 0.2], 3, bgColor);
                            try { addComponent(leftPlatform, GorillaSurfaceOverride).field("overrideIndex").value = 61; } catch { }
                        //}
                    } else {
                        //if (leftPlatform != null) {
                            if (time = 5) {
                                Destroy(leftPlatform);
                                leftPlatform = null;
                            }
                        //}
                    }

                    if (rightGrab) {
                        //if (rightPlatform == null) {
                            const handTransform = rightHandTransform;
                            rightPlatform = createObject(handTransform.method("get_position").invoke(), handTransform.method("get_rotation").invoke(), [0.025, 0.15, 0.2], 3, bgColor);
                            try { addComponent(rightPlatform, GorillaSurfaceOverride).field("overrideIndex").value = 61; } catch { }
                        //}
                    } else {
                        //if (rightPlatform != null) {
                            if (time = 5) {
                                Destroy(rightPlatform);
                                rightPlatform = null;
                            }
                        //}
                    }
                },
                toolTip: "Spawns slippy platforms when holding grip."
            }),

            new ButtonInfo({
                buttonText: "Trigger Frozone",
            }),

            new ButtonInfo({
                buttonText: "Fly",
                method: () => {
                    if (rightPrimary) {
                        rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);

                        const transform = getTransform(GorillaTagger);
                        let forward = getTransform(headCollider).method("get_forward").invoke();

                        let position = transform.method("get_position").invoke();
                        forward = Vector3.method("op_Multiply", 2).invoke(forward, 25.0 * deltaTime);

                        position = Vector3.method("op_Addition", 2).invoke(position, forward);

                        transform.method("set_position").invoke(position);
                    }
                },
                toolTip: "Lets you fly around while holding A."
            }),

            new ButtonInfo({
                buttonText: "Fly [B]",
                method: () => {
                    if (rightSecondary) {
      rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);

      const transform = getTransform(GorillaTagger);

      let forward = getTransform(rightHandTransform).method("get_up").invoke();

      forward = Vector3.method("op_Multiply", 2).invoke(forward, -1);

      let position = transform.method("get_position").invoke();

      forward = Vector3.method("op_Multiply", 2).invoke(forward, 25.0 * deltaTime);

      position = Vector3.method("op_Addition", 2).invoke(position, forward);

      transform.method("set_position").invoke(position);
    }
                },
                toolTip: "Lets you fly around while holding A."
            }),

            new ButtonInfo({
                buttonText: "Trigger Fly",
                method: () => {
                    if (rightTrigger) {
                        rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);

                        const transform = getTransform(GorillaTagger);
                        let forward = getTransform(headCollider).method("get_forward").invoke();

                        let position = transform.method("get_position").invoke();
                        forward = Vector3.method("op_Multiply", 2).invoke(forward, 25.0 * deltaTime);

                        position = Vector3.method("op_Addition", 2).invoke(position, forward);

                        transform.method("set_position").invoke(position);
                    }
                },
                toolTip: "Lets you fly around while holding trigger."
            }),

            new ButtonInfo({
                buttonText: "Trigger No-Gravity Fly",
                method: () => {
                    if (rightTrigger) {
                        rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);

                        const transform67 = getTransform(GorillaTagger);
                        let forward67 = getTransform(headCollider).method("get_forward").invoke();

                        let position67 = transform67.method("get_position").invoke();
                        forward67 = Vector3.method("op_Multiply", 2).invoke(forward67, 25.0 * deltaTime);

                        position67 = Vector3.method("op_Addition", 2).invoke(position67, forward67);

                        transform67.method("set_position").invoke(position67);

                        const mulQV = Quaternion.methods.find(m =>
                            m.name === "op_Multiply" &&
                            m.parameterCount === 2 &&
                            m.parameters[1].type.name.endsWith("Vector3")
                        ); // chatgpt no orhweer way to find this

                        rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);

                        const transform = getTransform(GorillaTagger);
                        const vrot = Quaternion.method("op_Multiply", 2).invoke(rightHandTransform.method("get_rotation").invoke(), GTPlayer.field("rightHand").field("handRotOffset").value);
                        const vfor = Vector3.method("get_forward").invoke();
                        let forward = mulQV.invoke(vrot, vfor);

                        let position = transform.method("get_position").invoke();
                        forward = Vector3.method("op_Multiply", 2).invoke(forward, 25.0 * deltaTime);

                        position = Vector3.method("op_Addition", 2).invoke(position, forward);

                        transform.method("set_position").invoke(position);
                    }
                },
                toolTip: "Lets you fly around with your hand while holding A."
            }),

            new ButtonInfo({
                buttonText: "Hand Fly",
                method: () => {
                    if (rightPrimary) {
                        rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);

                        const transform = getTransform(GorillaTagger);
                        const vrot = Quaternion.method("op_Multiply", 2).invoke(rightHandTransform.method("get_rotation").invoke(), GTPlayer.field("rightHand").field("handRotOffset").value);
                        const vfor = Vector3.method("get_forward").invoke();
                        const whore = vrot + vfor;
                        let forward = getTransform(whore);

                        let position = transform.method("get_position").invoke();
                        forward = Vector3.method("op_Multiply", 2).invoke(forward, 25.0 * deltaTime);

                        position = Vector3.method("op_Addition", 2).invoke(position, forward);

                        transform.method("set_position").invoke(position);
                    }
                },
                toolTip: "Lets you fly around with your hand while holding A."
            }),

            new ButtonInfo({
                buttonText: "Classic Hand Fly",
                method: () => {
                    if (rightPrimary) {
                        const mulQV = Quaternion.methods.find(m =>
                            m.name === "op_Multiply" &&
                            m.parameterCount === 2 &&
                            m.parameters[1].type.name.endsWith("Vector3")
                        ); // chatgpt no orhweer way to find this

                        rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);

                        const transform = getTransform(GorillaTagger);
                        const vrot = Quaternion.method("op_Multiply", 2).invoke(rightHandTransform.method("get_rotation").invoke(), GTPlayer.field("rightHand").field("handRotOffset").value);
                        const vfor = Vector3.method("get_forward").invoke();
                        let forward = mulQV.invoke(vrot, vfor);

                        let position = transform.method("get_position").invoke();
                        forward = Vector3.method("op_Multiply", 2).invoke(forward, 25.0 * deltaTime);

                        position = Vector3.method("op_Addition", 2).invoke(position, forward);

                        transform.method("set_position").invoke(position);
                    }
                },
                toolTip: "Lets you fly around with your hand while holding A."
            }),

            new ButtonInfo({
                buttonText: "<b>SUPER SLOW</b> Time",
                method: () => {
                    const speed = -10.0;
                    let disp = Vector3.method("op_Addition", 2).invoke(rigidbody.method("get_linearVelocity").invoke(), Physics.method("get_gravity").invoke());
                    disp = Vector3.method("op_Multiply", 2).invoke(disp, Time.method("get_fixedDeltaTime").invoke() * speed);
                    rigidbody.method("MovePosition").invoke(Vector3.method("op_Addition", 2).invoke(rigidbody.method("get_position").invoke(), disp))
                },
                toolTip: "Speeds up physics."
            }),

            new ButtonInfo({
                buttonText: "Slow Time",
                method: () => {
                    const speed = -0.15;
                    let disp = Vector3.method("op_Addition", 2).invoke(rigidbody.method("get_linearVelocity").invoke(), Physics.method("get_gravity").invoke());
                    disp = Vector3.method("op_Multiply", 2).invoke(disp, Time.method("get_fixedDeltaTime").invoke() * speed);
                    rigidbody.method("MovePosition").invoke(Vector3.method("op_Addition", 2).invoke(rigidbody.method("get_position").invoke(), disp))
                },
                toolTip: "Slows down physics."
            }),

            new ButtonInfo({
                buttonText: "Quick Time",
                method: () => {
                    const speed = 0.15;
                    let disp = Vector3.method("op_Addition", 2).invoke(rigidbody.method("get_linearVelocity").invoke(), Physics.method("get_gravity").invoke());
                    disp = Vector3.method("op_Multiply", 2).invoke(disp, Time.method("get_fixedDeltaTime").invoke() * speed);
                    rigidbody.method("MovePosition").invoke(Vector3.method("op_Addition", 2).invoke(rigidbody.method("get_position").invoke(), disp))
                },
                toolTip: "Speeds up physics."
            }),

            new ButtonInfo({
                buttonText: "<b>SUPER QUICK</b> Time",
                method: () => {
                    const speed = 10.0;
                    let disp = Vector3.method("op_Addition", 2).invoke(rigidbody.method("get_linearVelocity").invoke(), Physics.method("get_gravity").invoke());
                    disp = Vector3.method("op_Multiply", 2).invoke(disp, Time.method("get_fixedDeltaTime").invoke() * speed);
                    rigidbody.method("MovePosition").invoke(Vector3.method("op_Addition", 2).invoke(rigidbody.method("get_position").invoke(), disp))
                },
                toolTip: "Speeds up physics."
            }),

            new ButtonInfo({
                buttonText: "Up And Down",
                method: () => {
                    if (rightTrigger && rightGrab) {
                        rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);
                    }
                    if (rightTrigger && !rightGrab) {
                        rigidbody.method("AddForce").invoke(Vector3.field("upVector").value, 175 * deltaTime);
                    }
                    if (!rightTrigger && rightGrab) {
                        rigidbody.method("AddForce").invoke(Vector3.field("downVector").value, 175 * deltaTime);
                    }
                },
                toolTip: "Makes you go up when holding trigger, and down when holding grip."
            }),

            new ButtonInfo({
                buttonText: "Up And Down 2 ",
                method: () => {
                    if (rightTrigger && rightGrab) {
                        rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);
                    }
                    if (rightTrigger && !rightGrab) {
                        rigidbody.method("AddForce").invoke(Vector3.method("op_Addition").invoke([0, 175 * deltaTime, 0]));
                    }
                    if (!rightTrigger && rightGrab) {
                        rigidbody.method("AddForce").invoke(Vector3.method("op_Addition").invoke([0, 175 * deltaTime, 0]));
                    }
                },
                toolTip: "Makes you go up when holding trigger, and down when holding grip."
            }),

            new ButtonInfo({
                buttonText: "Up And Down  3   ",
                method: () => {
                    if (rightTrigger && rightGrab) {
                        rigidbody.method("set_velocity").invoke(Vector3.field("zeroVector").value);
                    }
                    if (rightTrigger && !rightGrab) {
                        rigidbody.method("AddForce").invoke(Vector3.method("op_Addition").invoke([0, 2.5, 0]));
                    }
                    if (!rightTrigger && rightGrab) {
                        rigidbody.method("AddForce").invoke(Vector3.method("op_Addition").invoke([0, 2.5, 0]));
                    }
                },
                toolTip: "Makes you go up when holding trigger, and down when holding grip."
            }),

            new ButtonInfo({
                buttonText: "Size Changer",
                disableMethod: () => {
                    GTPlayer.field("nativeScale").value = 1;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                method: () => {
                    if (leftPrimary) {
                        GTPlayer.field("nativeScale").value = 1;
                        getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                    }
                    if (rightTrigger) {
                        GTPlayer.field("nativeScale").value += 0.01;
                        getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                    }
                    if (leftTrigger) {
                        GTPlayer.field("nativeScale").value -= 0.01;
                        getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                    }
                },
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "GIANT MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value = 10;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "HUGE MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value = 5;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "BIG MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value = 2.5;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "NORMAL MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value = 1;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "ORIGINAL SMALL MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value = 0.5;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "ORIG SMALL MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value = 0.25;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "0.1 SMALL MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value = 0.1;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "SMALL MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value += -2.5;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "MOUSE MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value += -5;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "MINI MONKE ",
                method: () => {
                    GTPlayer.field("nativeScale").value += -10;
                    getTransform(LocalRig).method("set_localScale").invoke(Vector3.field("one").value.method("op_Multiply").invoke(LocalRig.field("NativeScale").value));
                },
                isTogglable: false,
                toolTip: "Makes you able to change size with triggers."
            }),

            new ButtonInfo({
                buttonText: "Checkpoint",
                disableMethod: () => {
                    if (checkpoint != null) {
                        Destroy(checkpoint);
                        checkpoint = null;
                    }
                },
                method: () => {
                    if (rightGrab && !rightPrimary) {
                        if (checkpoint == null) {
                            const handTransform = rightHandTransform;
                            checkpoint = createObject(handTransform.method("get_position").invoke(), identityQuaternion, [0.2, 0.2, 0.2], 3, bgColor);
                            Destroy(getComponent(checkpoint, BoxCollider));
                        } else {
                            const handTransform = rightHandTransform;
                            checkpoint.method("get_transform").invoke().method("set_position").invoke(handTransform.method("get_position").invoke())
                        }
                    }
                    if (rightPrimary) {
                        if (checkpoint != null) {
                            teleportPlayer(checkpoint.method("get_transform").invoke().method("get_position").invoke())
                            rigidbody.method("set_velocity").invoke(zeroVector);
                            GTPlayer.method("set_position").invoke(checkpoint.method("get_transform").invoke().method("get_position").invoke());
                            GorillaTagger.method("set_position").invoke(checkpoint.method("get_transform").invoke().method("get_position").invoke());
                            rigidbody.method("set_position").invoke(checkpoint.method("get_transform").invoke().method("get_position").invoke());
                            Rigidbody.method("set_position").invoke(checkpoint.method("get_transform").invoke().method("get_position").invoke());
                        }
                    }
                },
                toolTip: "Place a checkpoint with grip and teleport to it with A."
            }),

            new ButtonInfo({
                buttonText: "Rewind",
                disableMethod: () => {
                    positions = [];
                },
                method: () => {
                    if (rightTrigger) {
                        const pos = positions[positions.length - 1];

                        teleportPlayer(pos[0]);
                        leftHandTransform.method("set_position").invoke(pos[1]);
                        rightHandTransform.method("set_position").invoke(pos[2]);
                        leftHandTransform.method("set_rotation").invoke(pos[3]);
                        rightHandTransform.method("set_rotation").invoke(pos[4]);
                        rigidbody.method("set_linearVelocity").invoke(pos[5]);

                        positions.pop();
                    } else {
                        positions.push([
                            bodyCollider.method("get_transform").invoke().method("get_position").invoke(),

                            leftHandTransform.method("get_position").invoke(),
                            rightHandTransform.method("get_position").invoke(),
                            
                            leftHandTransform.method("get_rotation").invoke(),
                            rightHandTransform.method("get_rotation").invoke(),

                            rigidbody.method("get_linearVelocity").invoke()
                        ]);
                        if (positions.length > 8640) {
                            positions.shift();
                        }
                    }
                },
                toolTip: "Brings you back in time when holding trigger."
            }),

            new ButtonInfo({
                buttonText: "No Tag Freeze",
                method: () => GTPlayer.field("disableMovement").value = false,
                toolTip: "Disables tag freeze on your character.",
            }),

            new ButtonInfo({
                buttonText: "Permanent Tag Freeze",
                method: () => GTPlayer.field("disableMovement").value = true,
                toolTip: "Disables tag freeze on your character.",
            }),

            new ButtonInfo({
                buttonText: "Enable Tag Freeze",
                method: () => GTPlayer.field("disableMovement").value = true,
                isTogglable: false,
                toolTip: "Enables tag freeze on your character.",
            }),

            new ButtonInfo({
                buttonText: "Disable Tag Freeze",
                method: () => GTPlayer.field("disableMovement").value = false,
                isTogglable: false,
                toolTip: "Disables tag freeze on your character.",
            }),

            new ButtonInfo({
                buttonText: "Low Gravity",
                method: () => {
                    const force = Vector3.method("op_Multiply", 2).invoke(Vector3.field("upVector").value, (deltaTime * (6.66 / deltaTime)));
                    rigidbody.method("AddForce", 2).invoke(force, 5);
                },
                toolTip: "Makes gravity lower on your character."
            }),

            new ButtonInfo({
                buttonText: "Zero Gravity",
                method: () => {
                    const force = Vector3.method("op_Multiply", 2).invoke(Vector3.field("upVector").value, (deltaTime * (9.81 / deltaTime)));
                    rigidbody.method("AddForce", 2).invoke(force, 5);
                },
                toolTip: "Makes gravity lower on your character."
            }),

            new ButtonInfo({
                buttonText: "High Gravity",
                method: () => {
                    const force = Vector3.method("op_Multiply", 2).invoke(Vector3.field("downVector").value, (deltaTime * (7.77 / deltaTime)));
                    rigidbody.method("AddForce", 2).invoke(force, 5);
                },
                toolTip: "Makes gravity higher on your character."
            }),

            new ButtonInfo({
                buttonText: "Super High Gravity",
                method: () => {
                    const force = Vector3.method("op_Multiply", 2).invoke(Vector3.field("downVector").value, (deltaTime * (7.77 / deltaTime)));
                    rigidbody.method("AddForce", 2).invoke(force, 5);
                },
                toolTip: "Makes gravity higher on your character."
            }),

            new ButtonInfo({
                buttonText: "Weak Wall Walk",
                method: () => {
                    if (GTPlayer.method("IsHandTouching").invoke(true) || GTPlayer.method("IsHandTouching").invoke(false)) {
                        const ray = GTPlayer.field("lastHitInfoHand").value;
                        walkPos = ray.method("get_point").invoke();
                        walkNormal = ray.method("get_normal").invoke();
                    }
                    if (walkPos != Vector3.field("zeroVector").value && rightGrab) {
                        const force = Vector3.method("op_Multiply", 2).invoke(walkNormal, -5);
                        rigidbody.method("AddForce").invoke(force, 5);
                        const zeroForce = Vector3.method("op_Multiply", 2).invoke(Vector3.field("upVector").value, (deltaTime * (9.81 / deltaTime)));
                        rigidbody.method("AddForce", 2).invoke(zeroForce, 5);
                    }
                },
                toolTip: "Makes you get brought towards any wall you touch when holding grip, but weaker."
            }),

            new ButtonInfo({
                buttonText: "Wall Walk",
                method: () => {
                    if (GTPlayer.method("IsHandTouching").invoke(true) || GTPlayer.method("IsHandTouching").invoke(false)) {
                        const ray = GTPlayer.field("lastHitInfoHand").value;
                        walkPos = ray.method("get_point").invoke();
                        walkNormal = ray.method("get_normal").invoke();
                    }
                    if (walkPos != Vector3.field("zeroVector").value && rightGrab) {
                        const force = Vector3.method("op_Multiply", 2).invoke(walkNormal, -9.81);
                        rigidbody.method("AddForce").invoke(force, 5);
                        const zeroForce = Vector3.method("op_Multiply", 2).invoke(Vector3.field("upVector").value, (deltaTime * (9.81 / deltaTime)));
                        rigidbody.method("AddForce", 2).invoke(zeroForce, 5);
                    }
                },
                toolTip: "Makes you get brought towards any wall you touch when holding grip."
            }),

            new ButtonInfo({
                buttonText: "Strong Wall Walk",
                method: () => {
                    if (GTPlayer.method("IsHandTouching").invoke(true) || GTPlayer.method("IsHandTouching").invoke(false)) {
                        const ray = GTPlayer.field("lastHitInfoHand").value;
                        walkPos = ray.method("get_point").invoke();
                        walkNormal = ray.method("get_normal").invoke();
                    }
                    if (walkPos != Vector3.field("zeroVector").value && rightGrab) {
                        const force = Vector3.method("op_Multiply", 2).invoke(walkNormal, -17.29);
                        rigidbody.method("AddForce").invoke(force, 5);
                        const zeroForce = Vector3.method("op_Multiply", 2).invoke(Vector3.field("upVector").value, (deltaTime * (9.81 / deltaTime)));
                        rigidbody.method("AddForce", 2).invoke(zeroForce, 5);
                    }
                },
                toolTip: "Makes you get brought towards any wall you touch when holding grip."
            }),

            new ButtonInfo({
                buttonText: "Teleport Gun",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const gunPointer = gunData.gunPointer;

                        if (rightTrigger && !perviousTeleportKey) {
                            teleportPlayer(getTransform(gunPointer).method("get_position").invoke())
                            rigidbody.method("set_velocity").invoke(zeroVector);
                        }

                        perviousTeleportKey = rightTrigger;
                    }
                },
                toolTip: "Teleports you to wherever your hand desires."
            }),

            new ButtonInfo({
                buttonText: "Airstrike Gun",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const gunPointer = gunData.gunPointer;

                        if (rightTrigger && !perviousTeleportKey) {
                            teleportPlayer(Vector3.method("op_Addition", 2).invoke([0, 30, 0], getTransform(gunPointer).method("get_position").invoke()))
                            rigidbody.method("set_velocity").invoke(zeroVector);
                        }

                        perviousTeleportKey = rightTrigger;
                    }
                },
                toolTip: "Teleports you to wherever your hand desires, except farther up, then launches you back down."
            }),

            new ButtonInfo({
                buttonText: "Airstrike Random",
                method: () => {
                    const vrrigs = GorillaParent.field("vrrigs").value;
                    const vrrigtotal = vrrigs.method("get_Count").invoke();
                    const playerRig = vrrigs.method("get_Item").invoke(Math.floor(Math.random() * vrrigtotal));
                    teleportPlayer(Vector3.method("op_Addition", 2).invoke([0, 30, 0], getTransform(playerRig).method("get_position").invoke()));
                    rigidbody.method("set_velocity").invoke(zeroVector);
                },
                isTogglable: false,
                toolTip: "Teleports you to a random player, except farther up, then launches you back down."
            }),

            new ButtonInfo({
                buttonText: "Teleport To Random",
                method: () => {
                    const vrrigs = GorillaParent.field("vrrigs").value;
                    const vrrigtotal = vrrigs.method("get_Count").invoke();
                    const playerRig = vrrigs.method("get_Item").invoke(Math.floor(Math.random() * vrrigtotal));
                    teleportPlayer(getTransform(playerRig).method("get_position").invoke());
                    rigidbody.method("set_velocity").invoke(zeroVector);
                },
                isTogglable: false,
                toolTip: "Teleports you to a random player."
            }),

            new ButtonInfo({
                buttonText: "Dash",
                method: () => {
                    if (rightPrimary && !previousDash) {
                        const leftRightVector = getTransform(headCollider).method("get_forward").invoke();
                        const leftForce = Vector3.method("op_Multiply", 2).invoke(leftRightVector, 10.0);
                        rigidbody.method("AddForce", 2).invoke(leftForce, 2);
                    }
                    previousDash = rightPrimary;
                },
                toolTip: "Flings your character forwards when pressing A."
            }),

            new ButtonInfo({
                buttonText: "Iron Man",
                method: () => {
                    if (leftPrimary) {
                        const leftRightVector = leftHandTransform.method("get_right").invoke();
                        const leftForce = Vector3.method("op_Multiply", 2).invoke(leftRightVector, -15.0 * deltaTime);
                        rigidbody.method("AddForce", 2).invoke(leftForce, 2);
                    }
                    if (rightPrimary) {
                        const leftRightVector = rightHandTransform.method("get_right").invoke();
                        const leftForce = Vector3.method("op_Multiply", 2).invoke(leftRightVector, 15.0 * deltaTime);
                        rigidbody.method("AddForce", 2).invoke(leftForce, 2);
                    }
                },
                toolTip: "Turns you into iron man. Use A and X to fly."
            }),

            new ButtonInfo({
                buttonText: "Noclip",
                method: () => {
                    if (rightTrigger && !previousNoclipKey) {
                        toggleColliders(false);
                    }

                    if (!rightTrigger && previousNoclipKey) {
                        toggleColliders(true);
                    }

                    previousNoclipKey = rightTrigger;
                },
                toolTip: "Lets you clip through objects while holding right trigger."
            }),

            new ButtonInfo({
                buttonText: "Legit Long Arms",
                method: () => {
                    getTransform(GorillaTagger).method("set_localScale").invoke([1.08, 1.08, 1.08]);
                },
                disableMethod: () => {
                    getTransform(GorillaTagger).method("set_localScale").invoke(oneVector);
                },
                toolTip: "Gives you Slightly longer arms."
            }),

            new ButtonInfo({
                buttonText: "Long Arms",
                method: () => {
                    getTransform(GorillaTagger).method("set_localScale").invoke([1.25, 1.25, 1.25]);
                },
                disableMethod: () => {
                    getTransform(GorillaTagger).method("set_localScale").invoke(oneVector);
                },
                toolTip: "Gives you longer arms."
            }),

            new ButtonInfo({
                buttonText: "Steam Long Arms",
                method: () => {
                    getTransform(GorillaTagger).method("set_localScale").invoke([1.34, 1.34, 1.34]);
                },
                disableMethod: () => {
                    getTransform(GorillaTagger).method("set_localScale").invoke(oneVector);
                },
                toolTip: "Gives you longer arms."
            }),

            new ButtonInfo({
                buttonText: "Broken Long Arms",
                method: () => {
                    getTransform(GorillaTagger).method("set_localScale").invoke([2.5, 2.5, 2.5]);
                },
                disableMethod: () => {
                    getTransform(GorillaTagger).method("set_localScale").invoke(oneVector);
                },
                toolTip: "Gives you longer arms."
            }),

            new ButtonInfo({
                buttonText: "Speed Boost",
                method: () => {
                    GTPlayer.field("maxJumpSpeed").value = 9.0;
                    GTPlayer.method("set_jumpMultiplier").invoke(1.5);
                },
                toolTip: "Gives you a speed boost."
            }),

            new ButtonInfo({
                buttonText: "Slide Control",
                enableMethod: () => {
                    oldSlide = GTPlayer.field("slideControl").value;
                    GTPlayer.field("slideControl").value = 1;
                },
                disableMethod: () => GTPlayer.field("slideControl").value = oldSlide,
                toolTip: "Lets you control yourself on ice perfectly."
            }),

            new ButtonInfo({
                buttonText: "Predictions",
                enableMethod: () => {
                    lvT = createObject(zeroVector, identityQuaternion, zeroVector, 0, [0.0, 0.0, 0.0, 0.0]);
                    Destroy(getComponent(lvT, BoxCollider))
                    addComponent(lvT, GorillaVelocityTracker);

                    rvT = createObject(zeroVector, identityQuaternion, zeroVector, 0, [0.0, 0.0, 0.0, 0.0]);
                    Destroy(getComponent(rvT, BoxCollider))
                    addComponent(rvT, GorillaVelocityTracker);
                },
                method: () => {
                    let predCount = 0.02;

                    getTransform(lvT).method("set_position").invoke(Vector3.method("op_Subtraction", 2).invoke(getTransform(headCollider).method("get_position").invoke(), leftHandTransform.method("get_position").invoke()));
                    getTransform(rvT).method("set_position").invoke(Vector3.method("op_Subtraction", 2).invoke(getTransform(headCollider).method("get_position").invoke(), rightHandTransform.method("get_position").invoke()));

                    let leftHandPosition = leftHandTransform.method("get_position").invoke();
                    let rightHandPosition = rightHandTransform.method("get_position").invoke();

                    let leftHandVelocity = getComponent(lvT, GorillaVelocityTracker).method("GetAverageVelocity").invoke(true, 0.0, false);
                    let rightHandVelocity = getComponent(rvT, GorillaVelocityTracker).method("GetAverageVelocity").invoke(true, 0.0, false);

                    leftHandVelocity = Vector3.method("op_Multiply", 2).invoke(leftHandVelocity, predCount);
                    rightHandVelocity = Vector3.method("op_Multiply", 2).invoke(rightHandVelocity, predCount);

                    leftHandPosition = Vector3.method("op_Subtraction", 2).invoke(leftHandPosition, leftHandVelocity);
                    rightHandPosition = Vector3.method("op_Subtraction", 2).invoke(rightHandPosition, rightHandVelocity);

                    leftHandTransform.method("set_position").invoke(leftHandPosition);
                    rightHandTransform.method("set_position").invoke(rightHandPosition);
                },
                disableMethod: () => {
                    Destroy(lvT);
                    Destroy(rvT);
                },
                toolTip: "Gives your controllers higher predictions."
            }),
        ],

        [ // Fun Mods [4]
            new ButtonInfo({
                buttonText: "Exit Fun Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            new ButtonInfo({
                buttonText: "Become EyeCantSee",
                method: () => {
                    setPlayerName("EyeCantSee");
                    setPlayerColor([1.0, 0.5, 0.0]);
                },
                isTogglable: false,
                toolTip: "Turns you into goldentrophy."
            }),
            new ButtonInfo({
                buttonText: "Become \"EyeIsTuffy\"",
                method: () => {
                    setPlayerName("EyeIsTuffy");
                    setPlayerColor([0.7, 0.9, 0.2]);
                },
                isTogglable: false,
                toolTip: "Turns you into goldentrophy."
            }),
            new ButtonInfo({
                buttonText: "Become \"EvilEyePinataController\"",
                method: () => {
                    becomePlayer("EvilEyePinataController", [0.67, 0.67, 0.67]);
                },
                isTogglable: false,
                toolTip: "Turns you into goldentrophy."
            }),
            new ButtonInfo({
                buttonText: "Water Splash Hands",
                method: () => {
                    if (leftGrab && time > splashDelay) {
                        splashDelay = time + 0.1;
                        const objectArray = Il2Cpp.array(SystemObject, [leftHandTransform.method("get_position").invoke(), leftHandTransform.method("get_rotation").invoke(), 1.0, 0.5, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                    if (rightGrab && time > splashDelay) {
                        splashDelay = time + 0.1;
                        const objectArray = Il2Cpp.array(SystemObject, [rightHandTransform.method("get_position").invoke(), rightHandTransform.method("get_rotation").invoke(), 1.0, 0.5, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                },
                toolTip: "Splashes water on your hands when pressing your grips."
            }),
            new ButtonInfo({
                buttonText: "Water Cum Hands",
                method: () => {
                    if (leftGrab && time > splashDelay) {
                        splashDelay = time + 0.0000000000000000000000000000000000000000000000000000001;
                        const objectArray = Il2Cpp.array(SystemObject, [leftHandTransform.method("get_position").invoke(), leftHandTransform.method("get_rotation").invoke(), 67.69, 67.69, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                    if (rightGrab && time > splashDelay) {
                        splashDelay = time + 0.0000000000000000000000000000000000000000000000000000001;
                        const objectArray = Il2Cpp.array(SystemObject, [rightHandTransform.method("get_position").invoke(), rightHandTransform.method("get_rotation").invoke(), 67.69, 67.69, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                    if (leftTrigger && time > splashDelay) {
                        splashDelay = time + 0.0000000000000000000000000000000000000000000000000000001;
                        const objectArray = Il2Cpp.array(SystemObject, [leftHandTransform.method("get_position").invoke(), leftHandTransform.method("get_rotation").invoke(), 67.69, 67.69, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                    if (rightTrigger && time > splashDelay) {
                        splashDelay = time + 0.0000000000000000000000000000000000000000000000000000001;
                        const objectArray = Il2Cpp.array(SystemObject, [rightHandTransform.method("get_position").invoke(), rightHandTransform.method("get_rotation").invoke(), 67.69, 67.69, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                    if (leftPrimary && time > splashDelay) {
                        splashDelay = time + 0.0000000000000000000000000000000000000000000000000000001;
                        const objectArray = Il2Cpp.array(SystemObject, [leftHandTransform.method("get_position").invoke(), leftHandTransform.method("get_rotation").invoke(), 67.69, 67.69, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                    if (rightPrimary && time > splashDelay) {
                        splashDelay = time + 0.0000000000000000000000000000000000000000000000000000001;
                        const objectArray = Il2Cpp.array(SystemObject, [rightHandTransform.method("get_position").invoke(), rightHandTransform.method("get_rotation").invoke(), 67.69, 67.69, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                    if (leftSecondary && time > splashDelay) {
                        splashDelay = time + 0.0000000000000000000000000000000000000000000000000000001;
                        const objectArray = Il2Cpp.array(SystemObject, [leftHandTransform.method("get_position").invoke(), leftHandTransform.method("get_rotation").invoke(), 67.69, 67.69, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                    if (rightSecondary && time > splashDelay) {
                        splashDelay = time + 0.0000000000000000000000000000000000000000000000000000001;
                        const objectArray = Il2Cpp.array(SystemObject, [rightHandTransform.method("get_position").invoke(), rightHandTransform.method("get_rotation").invoke(), 67.69, 67.69, true, false]);

                        const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                            "System.String",
                            "Photon.Pun.RpcTarget",
                            "System.Object[]");

                        method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                    }
                },
                toolTip: "Shoots cum out yo dih | splashes cum on your hands when pressing any of ur buttons."
            }),
            new ButtonInfo({
                buttonText: "Water Splash Gun [1] ",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const gunPointer = gunData.gunPointer;

                        if (rightTrigger && time > splashDelay) {
                            splashDelay = time + 0.1;
                            const objectArray = Il2Cpp.array(SystemObject, [gunPointer.method("get_position").invoke(), gunPointer.method("get_rotation").invoke(), 1.0, 0.5, true, false]);

                            const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                                "System.String",
                                "Photon.Pun.RpcTarget",
                                "System.Object[]");

                            method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                        }
                    }
                },
                toolTip: "Splashes water on your hands when pressing your grips."
            }),
            new ButtonInfo({
                buttonText: "Water Splash Gun [2] ",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const gunPointer = gunData.gunPointer;

                        if (rightTrigger && time > splashDelay) {
                            splashDelay = time + 0.1;
                            const objectArray = Il2Cpp.array(SystemObject, [gunPointer, identityQuaternion, 1.0, 0.5, true, false]);

                            const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                                "System.String",
                                "Photon.Pun.RpcTarget",
                                "System.Object[]");

                            method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray);
                        }
                    }
                },
                toolTip: "Splashes water on your hands when pressing your grips."
            }),
            new ButtonInfo({
                buttonText: "SKIBIDI CUM GUN ",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const gunPointer = gunData.gunPointer;

                        let sexyassdelay = 0.000000000000000000000000000000000000002;

                        if (rightTrigger && time > splashDelay) {
                            splashDelay = time + 0.00000000000000000000000000000000000000000000000000000000000000001;
                            const objectArray1 = Il2Cpp.array(SystemObject, [gunPointer.method("get_position").invoke(), gunPointer.method("get_rotation").invoke(), 67.67, 67.67, true, false]);
                            const objectArray2 = Il2Cpp.array(SystemObject, [gunPointer, identityQuaternion, 67.67, 67.67, true, false]);

                            const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                                "System.String",
                                "Photon.Pun.RpcTarget",
                                "System.Object[]");

                            method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray1);
                            method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray2);
                        }

                        if (rightTrigger && sexyassdelay) {
                            sexyassdelay = 0.00000000000000000000000000000000000000000000000000000000000000001;
                            const objectArray1 = Il2Cpp.array(SystemObject, [gunPointer.method("get_position").invoke(), gunPointer.method("get_rotation").invoke(), 67.67, 67.67, true, false]);
                            const objectArray2 = Il2Cpp.array(SystemObject, [gunPointer, identityQuaternion, 67.67, 67.67, true, false]);

                            const method = GorillaTagger.method("get_myVRRig").invoke().method("SendRPC", 3).overload(
                                "System.String",
                                "Photon.Pun.RpcTarget",
                                "System.Object[]");

                            method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray1);
                            method.invoke(Il2Cpp.string("RPC_PlaySplashEffect"), 0, objectArray2);
                        }
                    }
                },
                toolTip: "Splashes water on your hands when pressing your grips."
            }),
            new ButtonInfo({
                buttonText: "Get Name Gun",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (rightTrigger) {
                            const gunTarget = getComponentInParent(ray.method("get_collider").invoke(), VRRig);
                            if (gunTarget && !gunTarget.handle.isNull() && time > idGunDelay) {
                                if (!playerIsLocal(gunTarget)) {
                                    idGunDelay = time + 0.5;
                                    const name0 = gunTarget.method("get_Creator").invoke().method("get_UserName").invoke();
                                    const name1 = gunTarget.method("get_Creator").invoke().method("get_userName").invoke();
                                    const name2 = gunTarget.method("get_Creator").invoke().method("get_Username").invoke();
                                    const name3 = gunTarget.method("get_Creator").invoke().method("get_Name").invoke();
                                    const name4 = gunTarget.method("get_Creator").invoke().method("get_Name").invoke();
                                    const name5 = gunTarget.method("get_Creator").invoke().method("get_User").invoke();
                                    sendNotification("Name: " + String(name0));
                                    sendNotification("Name: " + String(name1));
                                    sendNotification("Name: " + String(name2));
                                    sendNotification("Name: " + String(name3));
                                    sendNotification("Name: " + String(name4));
                                    sendNotification("Name: " + String(name5));
                                    console.log("Name: " + String(name0));
                                    console.log("Name: " + String(name1));
                                    console.log("Name: " + String(name2));
                                    console.log("Name: " + String(name3));
                                    console.log("Name: " + String(name4));
                                    console.log("Name: " + String(name5));
                                }
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Logs the ID of whoever your hand desires."
            }),
            new ButtonInfo({
                buttonText: "Get ID Gun",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (rightTrigger) {
                            const gunTarget = getComponentInParent(ray.method("get_collider").invoke(), VRRig);
                            if (gunTarget && !gunTarget.handle.isNull() && time > idGunDelay) {
                                if (!playerIsLocal(gunTarget)) {
                                    idGunDelay = time + 0.5;
                                    const id = gunTarget.method("get_Creator").invoke().method("get_UserId").invoke();
                                    sendNotification("ID: " + String(id));
                                }
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Logs the ID of whoever your hand desires."
            }),
            new ButtonInfo({
                buttonText: "Get Platform Gun",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (rightTrigger) {
                            const gunTarget = getComponentInParent(ray.method("get_collider").invoke(), VRRig);
                            if (gunTarget && !gunTarget.handle.isNull() && time > idGunDelay) {
                                if (!playerIsLocal(gunTarget)) {
                                    idGunDelay = time + 0.5;
                                    const player = gunTarget.method("get_Creator").invoke();
                                    const concat = String(gunTarget.field("concatStringOfCosmeticsAllowed").value);
                                    const isSteam = (concat.includes("S. FIRST LOGIN") || concat.includes("FIRST LOGIN")) && !concat.includes("LMAKT.");
                                    sendNotification(isSteam ? "PLATFORM: Steam" : "PLATFORM: Meta");
                                }
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Logs the platform of whoever your hand desires."
            }),
            new ButtonInfo({
                buttonText: "Punch Mod",
                method: () => {
                    // This is MORE optimized (BY A LOT) than the one in the steam menu.
                    const vrrigs = GorillaParent.field("vrrigs").value;
                    const vrrigtotal = vrrigs.method("get_Count").invoke();
                    let index = 0;
                    for (let i = 0; i < vrrigtotal; i++) {
                        const vrrig = vrrigs.method("get_Item").invoke(i);
                        index++;
                        let they = vrrig.field("rightHandTransform").value.method("get_position").invoke();
                        const notthem = getTransform(headCollider).method("get_position").invoke();
                        let distance = Vector3.method("Distance").invoke(they, notthem);
                        if (distance < 0.25) {
                            const vel = Vector3.method("op_Addition", 2).invoke(Vector3.method("op_Multiply").invoke(Vector3.method("Normalize").invoke(Vector3.method("op_Subtraction", 2).invoke(they, punchLastRight[index])), highPunchPower ? 10 : 5), rigidbody.method("get_velocity").invoke());
                            rigidbody.method("set_velocity").invoke(vel);
                        }
                        punchLastRight[index] = they;
                        they = vrrig.field("leftHandTransform").value.method("get_position").invoke();
                        distance = Vector3.method("Distance").invoke(they, notthem);
                        if (distance < 0.25) {
                            const vel = Vector3.method("op_Addition", 2).invoke(Vector3.method("op_Multiply").invoke(Vector3.method("Normalize").invoke(Vector3.method("op_Subtraction", 2).invoke(they, punchLastLeft[index])), highPunchPower ? 10 : 5), rigidbody.method("get_velocity").invoke());
                            rigidbody.method("set_velocity").invoke(vel);
                        }
                        punchLastLeft[index] = they;
                    }
                },
                toolTip: "Lets people punch you across the map."
            }),
            new ButtonInfo({
                buttonText: "Max Quest Score",
                method: () => {
                    LocalRig.method("SetQuestScore")?.invoke(999999)
                },
                isTogglable: false,
                toolTip: "Sets Your Quest Score To Max"
            }),
            new ButtonInfo({
                buttonText: "Max Ranked Level",
                method: () => {
                    LocalRig.method("SetRankedInfo", 4)?.invoke(4000.0, 7, 7, true);
                },
                isTogglable: false,
                toolTip: "Sets Your Ranked Level To Max"
            }),
        ],

        [ // Advantage Mods [5]
            new ButtonInfo({
                buttonText: "Exit Advantage Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),

            new ButtonInfo({
                buttonText: "Hand Noclip",
                method: () => {
                    GTPlayer.field("leftHandHolding").value = true;
                    GTPlayer.field("rightHandHolding").value = true;
                },
                disableMethod: () => {
                    GTPlayer.field("leftHandHolding").value = false;
                    GTPlayer.field("rightHandHolding").value = false;
                },
                toolTip: "Disables hand collisions."
            }),

            new ButtonInfo({
                buttonText: "Flick Tag Gun (Both Arms)",
                method: () => {
                    if (rightGrab) {
    const gunData = renderGun();
    const gunPointer = gunData.gunPointer;

    if (rightTrigger) {
                    const pos = getTransform(gunPointer).method("get_position").invoke();
                        leftHandTransform.method("set_position").invoke(pos);
                        rightHandTransform.method("set_position").invoke(pos);
                }
            }
                },
            }),

            new ButtonInfo({
                buttonText: "Flick Tag Gun (Left Arm)",
                method: () => {
                    if (rightGrab) {
    const gunData = renderGun();
    const gunPointer = gunData.gunPointer;

    if (rightTrigger) {
                    const pos = getTransform(gunPointer).method("get_position").invoke();
                        leftHandTransform.method("set_position").invoke(pos);
                }
            }
                },
            }),

            new ButtonInfo({
                buttonText: "Flick Tag Gun (Right Arm)",
                method: () => {
                    if (rightGrab) {
    const gunData = renderGun();
    const gunPointer = gunData.gunPointer;

    if (rightTrigger) {
                    const pos = getTransform(gunPointer).method("get_position").invoke();
                        rightHandTransform.method("set_position").invoke(pos);
                }
            }
                },
            }),

            new ButtonInfo({
                buttonText: "Tag Self",
                isTogglable: false,
                method: () => {
                    const vrrigs = GorillaParent.field("vrrigs").value;
                    const vrrigtotal = vrrigs.method("get_Count").invoke();
                    for (let i = 0; i < vrrigtotal; i++) {
                        const playerRig = vrrigs.method("get_Item").invoke(i);
                        if (playerIsLocal(playerRig)) {
                            serialize();
                            GameMode.method("ReportTag").invoke(playerRig.method("get_Creator").invoke());
                            GameMode.method("ReportTag").invoke(vrrigs.method("get_Creator").invoke());
                            GameMode.method("ReportTag").invoke(vrrigtotal.method("get_Creator").invoke());
                            GameMode.method("ReportTag").invoke(LocalRig.method("get_Creator").invoke());
                            GameMode.method("ReportTag").invoke(VRRig.method("get_Creator").invoke());
                            sendAllOutgoing();
                        }
                    }
                },
                toolTip: "Tags your self."
            }),

            new ButtonInfo({
                buttonText: "Tag Gun",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (rightTrigger) {
                            const gunTarget = getComponentInParent(ray.method("get_collider").invoke(), VRRig);
                            if (gunTarget && !gunTarget.handle.isNull() && time > tagGunDelay) {
                                if (!playerIsLocal(gunTarget)) {
                                    tagGunDelay = time + 0.5;
                                    LocalRig.method("set_enabled").invoke(false);
                                    getTransform(LocalRig).method("set_position").invoke(getTransform(gunTarget).method("get_position").invoke());
                                    serialize();
                                    GameMode.method("ReportTag").invoke(gunTarget.method("get_Creator").invoke());
                                    LocalRig.method("set_enabled").invoke(true);
                                    sendAllOutgoing();
                                }
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Tags whoever your hand desires."
            }),

            new ButtonInfo({
                buttonText: "Tag All",
                isTogglable: false,
                method: () => {
                    const vrrigs = GorillaParent.field("vrrigs").value;
                    const vrrigtotal = vrrigs.method("get_Count").invoke();
                    for (let i = 0; i < vrrigtotal; i++) {
                        const playerRig = vrrigs.method("get_Item").invoke(i);
                        if (!playerIsLocal(playerRig)) {
                            LocalRig.method("set_enabled").invoke(false);
                            getTransform(LocalRig).method("set_position").invoke(getTransform(playerRig).method("get_position").invoke());
                            serialize();
                            GameMode.method("ReportTag").invoke(playerRig.method("get_Creator").invoke());
                            LocalRig.method("set_enabled").invoke(true);
                            sendAllOutgoing();
                        }
                    }
                },
                toolTip: "Tags everyone."
            }),

            new ButtonInfo({
                buttonText: "Uncapped FPS",
                method: () => {
                    const targetDelta = 1 / 99999999999999999999999999999999999;
                    const elapsed = Time.method("get_realtimeSinceStartup").invoke() - lastTime;
                    if (elapsed < targetDelta) {
                        const sleepMs = Math.floor((targetDelta - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    lastTime = Time.method("get_realtimeSinceStartup").invoke();
                },
                isTogglable: true,
                toolTip: "Caps your FPS at 99999999999999999999999999999999999 frames per second."
            }),

            new ButtonInfo({
                buttonText: "90 FPS",
                method: () => {
                    const targetDelta = 1 / 90;
                    const elapsed = Time.method("get_realtimeSinceStartup").invoke() - lastTime;
                    if (elapsed < targetDelta) {
                        const sleepMs = Math.floor((targetDelta - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    lastTime = Time.method("get_realtimeSinceStartup").invoke();
                },
                isTogglable: true,
                toolTip: "Caps your FPS at 90 frames per second."
            }),

            new ButtonInfo({
                buttonText: "72 FPS",
                method: () => {
                    const targetDelta = 1 / 72;
                    const elapsed = Time.method("get_realtimeSinceStartup").invoke() - lastTime;
                    if (elapsed < targetDelta) {
                        const sleepMs = Math.floor((targetDelta - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    lastTime = Time.method("get_realtimeSinceStartup").invoke();
                },
                isTogglable: true,
                toolTip: "Caps your FPS at 72 frames per second."
            }),

            new ButtonInfo({
                buttonText: "60 FPS",
                method: () => {
                    const targetDelta = 1 / 60;
                    const elapsed = Time.method("get_realtimeSinceStartup").invoke() - lastTime;
                    if (elapsed < targetDelta) {
                        const sleepMs = Math.floor((targetDelta - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    lastTime = Time.method("get_realtimeSinceStartup").invoke();
                },
                isTogglable: true,
                toolTip: "Caps your FPS at 60 frames per second."
            }),

            new ButtonInfo({
                buttonText: "45 FPS",
                method: () => {
                    const targetDelta = 1 / 45;
                    const elapsed = Time.method("get_realtimeSinceStartup").invoke() - lastTime;
                    if (elapsed < targetDelta) {
                        const sleepMs = Math.floor((targetDelta - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    lastTime = Time.method("get_realtimeSinceStartup").invoke();
                },
                isTogglable: true,
                toolTip: "Caps your FPS at 45 frames per second."
            }),

            new ButtonInfo({
                buttonText: "30 FPS",
                method: () => {
                    const targetDelta = 1 / 30;
                    const elapsed = Time.method("get_realtimeSinceStartup").invoke() - lastTime;
                    if (elapsed < targetDelta) {
                        const sleepMs = Math.floor((targetDelta - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    lastTime = Time.method("get_realtimeSinceStartup").invoke();
                },
                isTogglable: true,
                toolTip: "Caps your FPS at 30 frames per second."
            }),

            new ButtonInfo({
                buttonText: "15 FPS",
                method: () => {
                    const targetDelta = 1 / 15;
                    const elapsed = Time.method("get_realtimeSinceStartup").invoke() - lastTime;
                    if (elapsed < targetDelta) {
                        const sleepMs = Math.floor((targetDelta - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    lastTime = Time.method("get_realtimeSinceStartup").invoke();
                },
                isTogglable: true,
                toolTip: "Caps your FPS at 15 frames per second."
            }),

            new ButtonInfo({
                buttonText: "Lag All | FPS ALL 0",
                method: () => {
                    const targetDelta1 = 1 / -1;
                    const targetDelta2 = 1 / 0;
                    const targetDelta3 = 1 / 1;
                    const elapsed = Time.method("get_realtimeSinceStartup").invoke() - lastTime;
                    if (elapsed < targetDelta1) {
                        const sleepMs = Math.floor((targetDelta1 - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    if (elapsed < targetDelta2) {
                        const sleepMs = Math.floor((targetDelta2 - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    if (elapsed < targetDelta3) {
                        const sleepMs = Math.floor((targetDelta3 - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    lastTime = Time.method("get_realtimeSinceStartup").invoke();
                },
                isTogglable: false,
                toolTip: "Caps everyones FPS at 0 frames per second."
            }),
            
            new ButtonInfo({
                buttonText: "Crash All | FPS ALL 0",
                method: () => {
                    const targetDelta1 = 1 / -1;
                    const targetDelta2 = 1 / 0;
                    const targetDelta3 = 1 / 1;
                    const elapsed = Time.method("get_realtimeSinceStartup").invoke() - lastTime;
                    if (elapsed < targetDelta1) {
                        const sleepMs = Math.floor((targetDelta1 - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    if (elapsed < targetDelta2) {
                        const sleepMs = Math.floor((targetDelta2 - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    if (elapsed < targetDelta3) {
                        const sleepMs = Math.floor((targetDelta3 - elapsed) * 1000);
                        if (sleepMs > 0)
                            Thread.method("Sleep").invoke(sleepMs);
                    }
                    lastTime = Time.method("get_realtimeSinceStartup").invoke();
                },
                isTogglable: true,
                toolTip: "Caps everyones FPS at 0 frames per second."
            }),
        ],
        [ // Rig Mods [6]
            new ButtonInfo({
                buttonText: "Exit Rig Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            
            new ButtonInfo({
                buttonText: "Disable Wind",
                enableMethod: () => { // yes, this is the placement of the mod in the steam menu. correct category and all.
                    getObject("Environment Objects/LocalObjects_Prefab/Forest/Environment/Forest_ForceVolumes/").method("SetActive").invoke(false);
                },
                disableMethod: () => {
                    getObject("Environment Objects/LocalObjects_Prefab/Forest/Environment/Forest_ForceVolumes/").method("SetActive").invoke(true);
                },
                toolTip: "Freezes your rig when pressing A."
            }),

            new ButtonInfo({
                buttonText: "Ghost",
                method: () => {
                    if (rightPrimary && !previousGhostKey) {
                        LocalRig.method("set_enabled").invoke(!LocalRig.method("get_enabled").invoke());
                    }
                    previousGhostKey = rightPrimary;
                },
                toolTip: "Freezes your rig when pressing A."
            }),

            new ButtonInfo({
                buttonText: "Invisible",
                method: () => {
                    if (rightSecondary && !previousInvisKey) {
                        LocalRig.method("set_enabled").invoke(!LocalRig.method("get_enabled").invoke());
                    }
                    if (!LocalRig.method("get_enabled").invoke()) {
                        getTransform(LocalRig).method("set_position").invoke([0, -99999, 0]);
                    }
                    previousInvisKey = rightSecondary;

                },
                toolTip: "Turns you invisible when pressing B."
            }),
            
            new ButtonInfo({
                buttonText: "Rig Gun",
                disableMethod: () => {
                    LocalRig.method("set_enabled").invoke(true);
                },
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const gunPointer = gunData.gunPointer;

                        if (rightTrigger) {
                            LocalRig.method("set_enabled").invoke(false);
                            const position = Vector3.method("op_Addition", 2).invoke([0, 1, 0], getTransform(gunPointer).method("get_position").invoke());
                            getTransform(LocalRig).method("set_position").invoke(position);
                        } else {
                            LocalRig.method("set_enabled").invoke(true);
                        }
                    }
                },
                toolTip: "Moves your rig to wherever your hand desires."
            }),
            new ButtonInfo({
                buttonText: "Change Rig Rotation",
                disableMethod: () => { LocalRig.method("set_enabled").invoke(true); },
                method: () => {
                    if (rightGrab) {
                        LocalRig.method("set_enabled").invoke(false);
                        getTransform(LocalRig).method("set_rotation").invoke(rightHandTransform.method("get_rotation").invoke());
                    }
                    else {
                        LocalRig.method("set_enabled").invoke(true);
                    }
                    if (leftGrab) {
                        LocalRig.method("set_enabled").invoke(false);
                        getTransform(LocalRig).method("set_rotation").invoke(leftHandTransform.method("get_rotation").invoke());
                    }
                    else {
                        LocalRig.method("set_enabled").invoke(true);
                    }
                },
                isTogglable: true,
                toolTip: "Lets you change your rigs rotation based on your hand rotation when holding either grip buttons"
            }),
            new ButtonInfo({
                buttonText: "Grab Rig",
                disableMethod: () => { LocalRig.method("set_enabled").invoke(true); },
                method: () => {
                    if (rightGrab) {
                        LocalRig.method("set_enabled").invoke(false);
                        getTransform(LocalRig).method("set_position").invoke(rightHandTransform.method("get_position").invoke());
                    }
                    else {
                        LocalRig.method("set_enabled").invoke(true);
                    }
                    if (leftGrab) {
                        LocalRig.method("set_enabled").invoke(false);
                        getTransform(LocalRig).method("set_position").invoke(leftHandTransform.method("get_position").invoke());
                    }
                    else {
                        LocalRig.method("set_enabled").invoke(true);
                    }
                },
                isTogglable: true,
                toolTip: "Lets you grab your rig"
            }),
            new ButtonInfo({
                buttonText: "Better Grab Rig",
                disableMethod: () => { LocalRig.method("set_enabled").invoke(true); },
                method: () => {
                    if (rightGrab) {
                        LocalRig.method("set_enabled").invoke(false);
                        getTransform(LocalRig).method("set_position").invoke(rightHandTransform.method("get_position").invoke());
                        getTransform(LocalRig).method("set_rotation").invoke(rightHandTransform.method("get_rotation").invoke());
                    }
                    else {
                        LocalRig.method("set_enabled").invoke(true);
                    }
                    if (leftGrab) {
                        LocalRig.method("set_enabled").invoke(false);
                        getTransform(LocalRig).method("set_position").invoke(leftHandTransform.method("get_position").invoke());
                        getTransform(LocalRig).method("set_rotation").invoke(leftHandTransform.method("get_rotation").invoke());
                    }
                    else {
                        LocalRig.method("set_enabled").invoke(true);
                    }
                },
                isTogglable: true,
                toolTip: "Lets you grab your rig"
            }),
            new ButtonInfo({
                buttonText: "Spaz Rig",
                method: () => {
                    const trackingRotationOffset = LocalRig.field("head").value.field("trackingRotationOffset").value;
                    trackingRotationOffset.field("x").value = Math.random() * 360.0;
                    trackingRotationOffset.field("y").value = Math.random() * 360.0;
                    trackingRotationOffset.field("z").value = Math.random() * 360.0;
                },
                disableMethod: () => {
                    const trackingRotationOffset = LocalRig.field("head").value.field("trackingRotationOffset").value;
                    trackingRotationOffset.field("x").value = 0.0;
                    trackingRotationOffset.field("y").value = 0.0;
                    trackingRotationOffset.field("z").value = 0.0;
                },
                toolTip: "Spazzes your rig out."
            }),

            new ButtonInfo({
                buttonText: "Classic Fix Head",
                method: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("x").value = 0.0;
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("y").value = 0.0;
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("z").value = 0.0;
                },
                isTogglable: false,
                toolTip: "Rotate head around the X axis."
            }),

            new ButtonInfo({
                buttonText: "Classic Spin Head X",
                method: () => {
                    const trackingRotationOffset = LocalRig.field("head").value.field("trackingRotationOffset").value;
                    trackingRotationOffset.field("x").value += 15.0;
                },
                toolTip: "Rotate head around the X axis."
            }),

            new ButtonInfo({
                buttonText: "Classic Spin Head Y",
                method: () => {
                    const trackingRotationOffset = LocalRig.field("head").value.field("trackingRotationOffset").value;
                    trackingRotationOffset.field("y").value += 15.0;
                },
                toolTip: "Rotate head around the X axis."
            }),

            new ButtonInfo({
                buttonText: "Classic Spin Head Z",
                method: () => {
                    const trackingRotationOffset = LocalRig.field("head").value.field("trackingRotationOffset").value;
                    trackingRotationOffset.field("z").value += 15.0;
                },
                toolTip: "Rotate head around the X axis."
            }),

            new ButtonInfo({
                buttonText: "Spin Head X",
                method: () => {
                    const trackingRotationOffset = LocalRig.field("head").value.field("trackingRotationOffset").value;
                    trackingRotationOffset.field("x").value += 15.0;
                },
                disableMethod: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("x").value = 0.0;
                },
                toolTip: "Rotate head around the X axis."
            }),

            new ButtonInfo({
                buttonText: "Spin Head Y",
                method: () => {
                    const trackingRotationOffset = LocalRig.field("head").value.field("trackingRotationOffset").value;
                    trackingRotationOffset.field("y").value += 15.0;
                },
                disableMethod: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("y").value = 0.0;
                },
                toolTip: "Rotate head around the Y axis."
            }),

            new ButtonInfo({
                buttonText: "Spin Head Z",
                method: () => {
                    const trackingRotationOffset = LocalRig.field("head").value.field("trackingRotationOffset").value;
                    trackingRotationOffset.field("z").value += 15.0;
                },
                disableMethod: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("z").value = 0.0;
                },
                toolTip: "Rotate head around the Z axis."
            }),
            new ButtonInfo({
                buttonText: "Upside Down Head",
                method: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("z").value = 180.0;
                },
                disableMethod: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("z").value = 0.0;
                },
                toolTip: "Flip your head upside down."
            }),

            new ButtonInfo({
                buttonText: "Broken Neck",
                method: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("z").value = 90.0;
                },
                disableMethod: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("z").value = 0.0;
                },
                toolTip: "Tilt your head sideways."
            }),

            new ButtonInfo({
                buttonText: "Backwards Head",
                method: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("y").value = 180.0;
                },
                disableMethod: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("y").value = 0.0;
                },
                toolTip: "Turn your head backwards."
            }),

            new ButtonInfo({
                buttonText: "Sideways Head",
                method: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("y").value = 90.0;
                },
                disableMethod: () => {
                    LocalRig.field("head").value.field("trackingRotationOffset").value.field("y").value = 0.0;
                },
                toolTip: "Rotate your head sideways."
            }),
        ],
        [ // Misc Mods [7]
            new ButtonInfo({
                buttonText: "Exit Misc Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),

            new ButtonInfo({
                buttonText: "Disconnect",
                method: () => {
                    try {
                        PhotonNetwork.method("LeaveRoom", 1).invoke(true);
                    } catch {
                        PhotonNetwork.method("Disconnect", 0).invoke(); // In the case of it not having/using LeaveRoom/LeaveRoom, 1 Like In A Copy (Close To New Version Or Possibly Old) It WIll Use Disconnect, 0 As A Fallback (disconnect, 0 is on newer 2024+ versions or 2025+, refer to menu disconnect for older versions as it doesnt use 0)
                    }
                },
                isTogglable: false,
                toolTip: "Disconnects you from the current room."
            }),

            new ButtonInfo({
                buttonText: "Join Random",
                method: () => { 
                    try {
                        PhotonNetwork.method("JoinRandomRoom", 0).invoke();
                    } catch {
                        PhotonNetwork.method("JoinRandomRoom").invoke(); // Use the non 0 version as a fallback if , 0 isnt present (old versions/copies, closer to newer version possibly)
                    }
                },
                isTogglable: false,
                toolTip: "Joins a random room."
            }),

            new ButtonInfo({
                buttonText: "Join Random 2",
                method: () => { 
                    PhotonNetwork.method("LeaveRoom", 1).invoke(true);
                    PhotonNetwork.method("LeaveRoom", 1).invoke(false);
                    PhotonNetwork.method("JoinRandomRoom", 0).invoke();
                    PhotonNetwork.method("ConnectUsingSettings").invoke();
                },
                isTogglable: false,
                toolTip: "use if the original mod doesnt work (due to connection errors, timeout or disconnection and reconnection to random from room)."
            }),
            
            new ButtonInfo({
                buttonText: "Photon Auth ?",
                method: () => { 
                    PhotonNetwork.method("ConnectUsingSettings").invoke();
                },
                isTogglable: false,
                toolTip: "Opens the movement category."
            }),

            new ButtonInfo({
                buttonText: "Connect to US",
                method: () => {
                    PhotonNetwork.method("ConnectToRegion").invoke(Il2Cpp.string("us"));
                },
                isTogglable: false,
                toolTip: "Connects you to the US region."
            }),

            new ButtonInfo({
                buttonText: "Connect to US West",
                method: () => {
                    PhotonNetwork.method("ConnectToRegion").invoke(Il2Cpp.string("usw"));
                },
                isTogglable: false,
                toolTip: "Connects you to the USW rwgion."
            }),

            new ButtonInfo({
                buttonText: "Connect to EU",
                method: () => {
                    PhotonNetwork.method("ConnectToRegion").invoke(Il2Cpp.string("eu"));
                },
                isTogglable: false,
                toolTip: "Connects you to the EU region."
            }),

            new ButtonInfo({
                buttonText: "Goon To The Goat LeBron (PERMANENT)",
                method: () => {
                    createObject(LocalRig.method("get_position").invoke(), LocalRig.method("get_rotation").invoke(), [0.025, 0.03, 0.05], 3, [1.0, 1.0, 1.0, 1.0]);
                },
                isTogglable: false,
                toolTip: "Makes you goon to the goat (LEBRON)."
            }),

            new ButtonInfo({
                buttonText: "Goon To The Goat LeBron",
                method: () => {
                    createObject(LocalRig.method("get_position").invoke(), LocalRig.method("get_rotation").invoke(), [0.025, 0.03, 0.05], 3, [1.0, 1.0, 1.0, 1.0]);
                },
                isTogglable: false,
                toolTip: "Makes you goon to the goat (LEBRON)."
            }),
        ],
        [ // Visual Mods [8]
            new ButtonInfo({
                buttonText: "Exit Visual Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            new ButtonInfo({
                buttonText: "Cosmetic Tracers",
                disableMethod: () => {
                    for (let line of linePool) {
                        line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                    }
                },
                method: () => {
                    if (frameCount % 5 != 0) {
                        for (let line of linePool) {
                            line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                        }
                        const vrrigs = GorillaParent.field("vrrigs").value;
                        const vrrigtotal = vrrigs.method("get_Count").invoke();
                        const rigs = [];
                        const cosmeticRigs = [];
                        for (let i = 0; i < vrrigtotal; i++) {
                            const playerRig = vrrigs.method("get_Item").invoke(i);
                            rigs.push(playerRig);
                            if (playerIsLocal(playerRig)) continue;
                            const concat = String(playerRig.field("concatStringOfCosmeticsAllowed").value);
                            if (concat.includes("LBAAD.")) { cosmeticRigs.push(i); continue; }; // Admin
                            if (concat.includes("LBAAK.")) { cosmeticRigs.push(i); continue; }; // Stick
                            if (concat.includes("LMAPY.")) { cosmeticRigs.push(i); continue; }; // Forest Guide
                            if (concat.includes("LBAGS.")) { cosmeticRigs.push(i); continue; }; // Illustrator
                            if (concat.includes("LBADE.")) { cosmeticRigs.push(i); continue; }; // Finger Painter
                            if (concat.includes("LBANI.")) { cosmeticRigs.push(i); continue; }; // AA Creator
                        }
                        for (let i = 0; i < vrrigtotal; i++) {
                            if (cosmeticRigs.includes(i) == false) continue;
                            const playerRig = rigs[i];
                            if (!playerIsLocal(playerRig)) {
                                const color = playerRig.field("playerColor").value;
                                if (lineRenderHolder == null) {
                                    lineRenderHolder = GameObject.new("LineRender_Holder");
                                }
                                let finalRender = null;
                                let nl = false;
                                for (let line of linePool) {
                                    if (finalRender != null) continue;
                                    if (line.method("get_gameObject").invoke().method("get_activeInHierarchy").invoke() == false) {
                                        line.method("get_gameObject").invoke().method("SetActive").invoke(true);
                                        finalRender = line;
                                        break;
                                    }
                                }
                                if (finalRender == null) {
                                    nl = true;
                                    const lineHolder = GameObject.new("LineObject");
                                    getTransform(lineHolder).method("set_parent").invoke(getTransform(lineRenderHolder));
                                    const newLine = addComponent(lineHolder, LineRenderer);
                                    const shader = Shader.method("Find").overload("System.String").invoke(Il2Cpp.string("GUI/Text Shader"));
                                    newLine.method("get_material").invoke().method("set_shader").invoke(shader);
                                    newLine.method("set_startWidth").invoke(0.025);
                                    newLine.method("set_endWidth").invoke(0.025);
                                    newLine.method("get_gameObject").invoke().method("SetActive").invoke(true);
                                    newLine.method("set_useWorldSpace").invoke(true);
                                    newLine.method("get_gameObject").invoke().method("set_layer").invoke(lineRenderHolder.method("get_layer").invoke());
                                    linePool.push(newLine);
                                    finalRender = newLine;
                                }
                                finalRender.method("set_startColor").invoke(color);
                                finalRender.method("set_endColor").invoke(color);
                                finalRender.method("SetPosition").invoke(1, getTransform(playerRig).method("get_position").invoke());
                                finalRender.method("SetPosition").invoke(0, rightHandTransform.method("get_position").invoke());
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Puts tracers on your right hand. Only shows players with rare cosmetics."
            }),
            new ButtonInfo({
                buttonText: "Casual Tracers",
                disableMethod: () => {
                    for (let line of linePool) {
                        line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                    }
                },
                method: () => {
                    if (frameCount % 3 == 0) {
                        for (let line of linePool) {
                            line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                        }
                        const rhp = rightHandTransform.method("get_position").invoke();
                        const vrrigs = GorillaParent.field("vrrigs").value;
                        const vrrigtotal = vrrigs.method("get_Count").invoke();
                        for (let i = 0; i < vrrigtotal; i++) {
                            const playerRig = vrrigs.method("get_Item").invoke(i);
                            if (!playerIsLocal(playerRig)) {
                                const color = playerRig.field("playerColor").value;
                                if (lineRenderHolder == null) {
                                    lineRenderHolder = GameObject.new("LineRender_Holder");
                                }
                                let finalRender = null;
                                let nl = false;
                                for (let line of linePool) {
                                    if (finalRender != null) continue;
                                    const lineObj = line.method("get_gameObject").invoke();
                                    if (lineObj.method("get_activeInHierarchy").invoke() == false) {
                                        lineObj.method("SetActive").invoke(true);
                                        finalRender = line;
                                        break;
                                    }
                                }
                                if (finalRender == null) {
                                    nl = true;
                                    const lineHolder = GameObject.new("LineObject");
                                    getTransform(lineHolder).method("set_parent").invoke(getTransform(lineRenderHolder));
                                    const newLine = addComponent(lineHolder, LineRenderer);
                                    const shader = Shader.method("Find").overload("System.String").invoke(Il2Cpp.string("GUI/Text Shader"));
                                    newLine.method("get_material").invoke().method("set_shader").invoke(shader);
                                    newLine.method("set_startWidth").invoke(0.025);
                                    newLine.method("set_endWidth").invoke(0.025);
                                    newLine.method("get_gameObject").invoke().method("SetActive").invoke(true);
                                    newLine.method("set_useWorldSpace").invoke(true);
                                    newLine.method("get_gameObject").invoke().method("set_layer").invoke(lineRenderHolder.method("get_layer").invoke());
                                    linePool.push(newLine);
                                    finalRender = newLine;
                                }
                                finalRender.method("set_startColor").invoke(color);
                                finalRender.method("set_endColor").invoke(color);
                                finalRender.method("SetPosition").invoke(0, rhp);
                                if (frameCount % 6 == 0)
                                    finalRender.method("SetPosition").invoke(1, getTransform(playerRig).method("get_position").invoke());
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Puts tracers on your right hand. Shows everyone."
            }),
            new ButtonInfo({
                buttonText: "Nearest Tracer",
                disableMethod: () => {
                    for (let line of linePool) {
                        line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                    }
                },
                method: () => {
                    if (frameCount % 5 != 0) {
                        let lowestDistance = Number.MAX_SAFE_INTEGER;
                        let closest = 0;
                        for (let line of linePool) {
                            line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                        }
                        const vrrigs = GorillaParent.field("vrrigs").value;
                        const vrrigtotal = vrrigs.method("get_Count").invoke();
                        const rigs = [];
                        for (let i = 0; i < vrrigtotal; i++) {
                            const playerRig = vrrigs.method("get_Item").invoke(i);
                            rigs.push(playerRig);
                            if (playerIsLocal(playerRig)) continue;
                            const dist = Vector3.method("Distance").invoke(getTransform(headCollider).method("get_position").invoke(), getTransform(playerRig).method("get_position").invoke());
                            if (lowestDistance > dist) {
                                lowestDistance = dist;
                                closest = i;
                            }
                        }
                        for (let i = 0; i < vrrigtotal; i++) {
                            if (i != closest) continue;
                            const playerRig = rigs[i];
                            if (!playerIsLocal(playerRig)) {
                                const color = playerRig.field("playerColor").value;
                                if (lineRenderHolder == null) {
                                    lineRenderHolder = GameObject.new("LineRender_Holder");
                                }
                                let finalRender = null;
                                let nl = false;
                                for (let line of linePool) {
                                    if (finalRender != null) continue;
                                    if (line.method("get_gameObject").invoke().method("get_activeInHierarchy").invoke() == false) {
                                        line.method("get_gameObject").invoke().method("SetActive").invoke(true);
                                        finalRender = line;
                                        break;
                                    }
                                }
                                if (finalRender == null) {
                                    nl = true;
                                    const lineHolder = GameObject.new("LineObject");
                                    getTransform(lineHolder).method("set_parent").invoke(getTransform(lineRenderHolder));
                                    const newLine = addComponent(lineHolder, LineRenderer);
                                    const shader = Shader.method("Find").overload("System.String").invoke(Il2Cpp.string("GUI/Text Shader"));
                                    newLine.method("get_material").invoke().method("set_shader").invoke(shader);
                                    newLine.method("set_startWidth").invoke(0.025);
                                    newLine.method("set_endWidth").invoke(0.025);
                                    newLine.method("get_gameObject").invoke().method("SetActive").invoke(true);
                                    newLine.method("set_useWorldSpace").invoke(true);
                                    newLine.method("get_gameObject").invoke().method("set_layer").invoke(lineRenderHolder.method("get_layer").invoke());
                                    linePool.push(newLine);
                                    finalRender = newLine;
                                }
                                finalRender.method("set_startColor").invoke(color);
                                finalRender.method("set_endColor").invoke(color);
                                finalRender.method("SetPosition").invoke(1, getTransform(playerRig).method("get_position").invoke());
                                finalRender.method("SetPosition").invoke(0, rightHandTransform.method("get_position").invoke());
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Puts tracers on your right hand. Shows only the nearest player to reduce lag."
            }),
            
            new ButtonInfo({
                buttonText: "Casual Cube ESP",
                disableMethod: () => {
                    for (let line of linePool) {
                        Destroy(line.method("get_gameObject").invoke());
                    }
                    linePool = [];
                },
                method: () => {
                    if (frameCount % 3 == 0) {
                        for (let line of linePool) {
                            line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                        }
                        const rhp = rightHandTransform.method("get_position").invoke();
                        const vrrigs = GorillaParent.field("vrrigs").value;
                        const vrrigtotal = vrrigs.method("get_Count").invoke();
                        for (let i = 0; i < vrrigtotal; i++) {
                            const playerRig = vrrigs.method("get_Item").invoke(i);
                            if (!playerIsLocal(playerRig)) {
                                const color = playerRig.field("playerColor").value;
                                if (lineRenderHolder == null) {
                                    lineRenderHolder = GameObject.new("LineRender_Holder");
                                }
                                let finalRender = null;
                                let nl = false;
                                for (let line of linePool) {
                                    if (finalRender != null) continue;
                                    const lineObj = line;
                                    if (lineObj.method("get_activeInHierarchy").invoke() == false) {
                                        lineObj.method("SetActive").invoke(true);
                                        finalRender = line;
                                        break;
                                    }
                                }
                                if (finalRender == null) {
                                    nl = true;
                                    const lineHolder = GameObject.method("CreatePrimitive").invoke(3);
                                    getTransform(lineHolder).method("set_parent").invoke(getTransform(lineRenderHolder));
                                    Destroy(getComponent(lineHolder, BoxCollider));
                                    getTransform(lineHolder).method("set_localScale").invoke([0.2, 0.2, 0.2]);
                                    const shader = Shader.method("Find").overload("System.String").invoke(Il2Cpp.string("GUI/Text Shader"));
                                    getComponent(lineHolder, Renderer).method("get_material").invoke().method("set_shader").invoke(shader);
                                    if (!espCollide)
                                        Destroy(getComponent(lineHolder, BoxCollider));
                                    linePool.push(lineHolder);
                                    finalRender = lineHolder;
                                }
                                getComponent(finalRender, Renderer).method("get_material").invoke().method("set_color").invoke(color);
                                getTransform(finalRender).method("set_position").invoke(getTransform(playerRig).method("get_position").invoke());
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Puts cubes on everyone."
            }),
            
            new ButtonInfo({
                buttonText: "Casual Cuboid ESP",
                disableMethod: () => {
                    for (let line of linePool) {
                        Destroy(line.method("get_gameObject").invoke());
                    }
                    linePool = [];
                },
                method: () => {
                    if (frameCount % 3 == 0) {
                        for (let line of linePool) {
                            line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                        }
                        const rhp = rightHandTransform.method("get_position").invoke();
                        const vrrigs = GorillaParent.field("vrrigs").value;
                        const vrrigtotal = vrrigs.method("get_Count").invoke();
                        for (let i = 0; i < vrrigtotal; i++) {
                            const playerRig = vrrigs.method("get_Item").invoke(i);
                            if (!playerIsLocal(playerRig)) {
                                const color = playerRig.field("playerColor").value;
                                if (lineRenderHolder == null) {
                                    lineRenderHolder = GameObject.new("LineRender_Holder");
                                }
                                let finalRender = null;
                                let nl = false;
                                for (let line of linePool) {
                                    if (finalRender != null) continue;
                                    const lineObj = line;
                                    if (lineObj.method("get_activeInHierarchy").invoke() == false) {
                                        lineObj.method("SetActive").invoke(true);
                                        finalRender = line;
                                        break;
                                    }
                                }
                                if (finalRender == null) {
                                    nl = true;
                                    const lineHolder = GameObject.method("CreatePrimitive").invoke(3);
                                    getTransform(lineHolder).method("set_parent").invoke(getTransform(lineRenderHolder));
                                    Destroy(getComponent(lineHolder, BoxCollider));
                                    getTransform(lineHolder).method("set_localScale").invoke([0.2, 0.4, 0.2]);
                                    const shader = Shader.method("Find").overload("System.String").invoke(Il2Cpp.string("GUI/Text Shader"));
                                    getComponent(lineHolder, Renderer).method("get_material").invoke().method("set_shader").invoke(shader);
                                    if (!espCollide)
                                        Destroy(getComponent(lineHolder, BoxCollider));
                                    linePool.push(lineHolder);
                                    finalRender = lineHolder;
                                }
                                getComponent(finalRender, Renderer).method("get_material").invoke().method("set_color").invoke(color);
                                getTransform(finalRender).method("set_position").invoke(getTransform(playerRig).method("get_position").invoke());
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Puts cuboids on everyone."
            }),
            
            new ButtonInfo({
                buttonText: "Casual Sphere ESP",
                disableMethod: () => {
                    for (let line of linePool) {
                        Destroy(line.method("get_gameObject").invoke());
                    }
                    linePool = [];
                },
                method: () => {
                    if (frameCount % 3 == 0) {
                        for (let line of linePool) {
                            line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                        }
                        const rhp = rightHandTransform.method("get_position").invoke();
                        const vrrigs = GorillaParent.field("vrrigs").value;
                        const vrrigtotal = vrrigs.method("get_Count").invoke();
                        for (let i = 0; i < vrrigtotal; i++) {
                            const playerRig = vrrigs.method("get_Item").invoke(i);
                            if (!playerIsLocal(playerRig)) {
                                const color = playerRig.field("playerColor").value;
                                if (lineRenderHolder == null) {
                                    lineRenderHolder = GameObject.new("LineRender_Holder");
                                }
                                let finalRender = null;
                                let nl = false;
                                for (let line of linePool) {
                                    if (finalRender != null) continue;
                                    const lineObj = line;
                                    if (lineObj.method("get_activeInHierarchy").invoke() == false) {
                                        lineObj.method("SetActive").invoke(true);
                                        finalRender = line;
                                        break;
                                    }
                                }
                                if (finalRender == null) {
                                    nl = true;
                                    const lineHolder = GameObject.method("CreatePrimitive").invoke(0);
                                    getTransform(lineHolder).method("set_parent").invoke(getTransform(lineRenderHolder));
                                    Destroy(getComponent(lineHolder, BoxCollider));
                                    getTransform(lineHolder).method("set_localScale").invoke([0.2, 0.2, 0.2]);
                                    const shader = Shader.method("Find").overload("System.String").invoke(Il2Cpp.string("GUI/Text Shader"));
                                    getComponent(lineHolder, Renderer).method("get_material").invoke().method("set_shader").invoke(shader);
                                    if (!espCollide)
                                        Destroy(getComponent(lineHolder, SphereCollider));
                                    linePool.push(lineHolder);
                                    finalRender = lineHolder;
                                }
                                getComponent(finalRender, Renderer).method("get_material").invoke().method("set_color").invoke(color);
                                getTransform(finalRender).method("set_position").invoke(getTransform(playerRig).method("get_position").invoke());
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Puts spheres on everyone."
            }),
            
            new ButtonInfo({
                buttonText: "Casual Capsule ESP",
                disableMethod: () => {
                    for (let line of linePool) {
                        Destroy(line.method("get_gameObject").invoke());
                    }
                    linePool = [];
                },
                method: () => {
                    if (frameCount % 3 == 0) {
                        for (let line of linePool) {
                            line.method("get_gameObject").invoke().method("SetActive").invoke(false);
                        }
                        const rhp = rightHandTransform.method("get_position").invoke();
                        const vrrigs = GorillaParent.field("vrrigs").value;
                        const vrrigtotal = vrrigs.method("get_Count").invoke();
                        for (let i = 0; i < vrrigtotal; i++) {
                            const playerRig = vrrigs.method("get_Item").invoke(i);
                            if (!playerIsLocal(playerRig)) {
                                const color = playerRig.field("playerColor").value;
                                if (lineRenderHolder == null) {
                                    lineRenderHolder = GameObject.new("LineRender_Holder");
                                }
                                let finalRender = null;
                                let nl = false;
                                for (let line of linePool) {
                                    if (finalRender != null) continue;
                                    const lineObj = line;
                                    if (lineObj.method("get_activeInHierarchy").invoke() == false) {
                                        lineObj.method("SetActive").invoke(true);
                                        finalRender = line;
                                        break;
                                    }
                                }
                                if (finalRender == null) {
                                    nl = true;
                                    const lineHolder = GameObject.method("CreatePrimitive").invoke(1);
                                    getTransform(lineHolder).method("set_parent").invoke(getTransform(lineRenderHolder));
                                    Destroy(getComponent(lineHolder, BoxCollider));
                                    getTransform(lineHolder).method("set_localScale").invoke([0.27, 0.4, 0.27]);
                                    const shader = Shader.method("Find").overload("System.String").invoke(Il2Cpp.string("GUI/Text Shader"));
                                    getComponent(lineHolder, Renderer).method("get_material").invoke().method("set_shader").invoke(shader);
                                    if (!espCollide)
                                        Destroy(getComponent(lineHolder, CapsuleCollider));
                                    linePool.push(lineHolder);
                                    finalRender = lineHolder;
                                }
                                getComponent(finalRender, Renderer).method("get_material").invoke().method("set_color").invoke(color);
                                getTransform(finalRender).method("set_position").invoke(getTransform(playerRig).method("get_position").invoke());
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Puts capsules on everyone."
            }),
        ],
        [ // Overpowered Mods [9]
            new ButtonInfo({
                buttonText: "Exit Overpowered Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),

            new ButtonInfo({
                buttonText: "Set Master",
                method: () => { 
                    const player = PhotonNetwork.method("get_LocalPlayer", 0).invoke();
                    PhotonNetwork.method("SetMasterClient", 1).invoke(player);
                },
                isTogglable: false,
                toolTip: "Master."
            }),

            new ButtonInfo({
                buttonText: "Lag Gun",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (rightTrigger) {
                            const gunTarget = getComponentInParent(ray.method("get_collider").invoke(), VRRig);
                            if (gunTarget && !gunTarget.handle.isNull() && time > lagGunDelay) {
                                if (!playerIsLocal(gunTarget)) {
                                    lagGunDelay = time + 2;

                                    const plRef = gunTarget.method("get_Creator").invoke().method("get_ActorNumber"/*GetPlayerRef"*/).invoke();
                                    const arr = Il2Cpp.array(SystemObject, 0);
                                    const rpc = FriendshipGroupDetection.field("photonView").value.method("RPC");
                                    for (let i = 0; i < 425; i++) {
                                        rpc.invoke(Il2Cpp.string("NotifyPartyMerging"), plRef, arr);
                                    }
                                    sendAllOutgoing();
                                }
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Lags whoever your hand desires. May be broken."
            }),

            new ButtonInfo({
                buttonText: "Lag Gun 2",
                method: () => {
                    if (rightGrab) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (rightTrigger) {
                            const gunTarget = getComponentInParent(ray.method("get_collider").invoke(), VRRig);
                            if (gunTarget && !gunTarget.handle.isNull() && time > lagGunDelay) {
                                if (!playerIsLocal(gunTarget)) {
                                    lagGunDelay = time + 2;

                                    const plRef = gunTarget.method("get_Creator").invoke().method("GetPlayerRef").invoke();
                                    const arr = Il2Cpp.array(SystemObject, 0);
                                    const rpc = FriendshipGroupDetection.field("photonView").value.method("RPC");
                                    for (let i = 0; i < 425; i++) {
                                        rpc.invoke(Il2Cpp.string("NotifyPartyMerging"), plRef, arr);
                                    }
                                    sendAllOutgoing();
                                }
                            }
                        }
                    }
                },
                isTogglable: true,
                toolTip: "Lags whoever your hand desires. May be broken."
            }),

            new ButtonInfo({
                buttonText: "Lag Gun 3",
                method: () => {
                        const PhotonViewClass = PhotonUnityNetworking.class("Photon.Pun.PhotonView");
                    if (rightGrab) {
                        const gunData = renderGun();
                        const ray = gunData.ray;

                        if (rightTrigger) {
                           const col = ray.method("get_collider").invoke();
                            const pv  = col.method("GetComponentInParent", 0).inflate(PhotonViewClass).invoke();
                            if (pv && !pv.isNull()) {
                                const owner = pv.method("get_Owner").invoke();
                                PhotonNetwork.method("SetMasterClient", 1)
                                    .invoke(PhotonNetwork.method("get_LocalPlayer").invoke());
                                PhotonNetwork.method("DestroyPlayerObjects").invoke(owner);
                    try {
                        getComponent(GunPointer, Renderer).method("get_material").invoke()
                            .method("set_color").invoke(Color.method("get_green").invoke());
                    } catch(_) {}
                    }
                }
            }
                },
                isTogglable: true,
                toolTip: "Lags whoever your hand desires. May be broken."
            }),

            new ButtonInfo({
                buttonText: "Destroy All",
                method: () => { 
                    PhotonNetwork.method("DestroyAll").invoke();
                },
                isTogglable: false,
                toolTip: "Destroy."
            }),

            new ButtonInfo({
                buttonText: "Crash All",
                method: () => { 
                    const playerListOthers = PhotonNetwork.method("get_PlayerListOthers", 0).invoke();
                    for (let i = 0; i < playerListOthers.method("get_Count").invoke(); i++) {
                        PhotonNetwork.method("DestroyPlayerObjects", 1).invoke(playerListOthers[i]);
                    }
                },
                isTogglable: false,
                toolTip: "crsaher."
            }),

            new ButtonInfo({
                buttonText: "Crash All 2",
                method: () => { 
                    const playerList = PhotonNetwork.method("get_PlayerList", 0).invoke();
                    PhotonNetwork.method("DestroyPlayerObjects", 1).invoke(playerList);
                },
                isTogglable: false,
                toolTip: "crsaher."
            }),
        ],
        [ // Safety Mods [10]
            new ButtonInfo({
                buttonText: "Exit Safety Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),

            new ButtonInfo({
                buttonText: "Anti Moderator",
                isTogglable: true,
                method: () => {
                    if (frameCount % 5 != 0) {
                        const vrrigs = GorillaParent.field("vrrigs").value;
                        const vrrigtotal = vrrigs.method("get_Count").invoke();
                        let shouldLeave = false;
                        for (let i = 0; i < vrrigtotal; i++) {
                            const playerRig = vrrigs.method("get_Item").invoke(i);
                            if (playerIsLocal(playerRig)) continue;
                            const concat = String(playerRig.field("concatStringOfCosmeticsAllowed").value);
                            if (concat.includes("LBAAD.")) { shouldLeave = true; break; }; // Admin
                            if (concat.includes("LBAAK.")) { shouldLeave = true; break; }; // Stick
                            if (concat.includes("LMAPY.")) { shouldLeave = true; break; }; // Forest Guide
                        }
                        if (shouldLeave == true) {
                            let room = "";
                            try {
                                room = String(PhotonNetwork.method("get_CurrentRoom").invoke().method("get_Name").invoke());
                            } finally {
                                NetworkSystem.method("ReturnToSinglePlayer").invoke();
                            }
                            for (let i = 0; i < 10; i++) {
                                console.log("Moderator in code " + room);
                            }
                            sendNotification("Moderator in code " + room, true, 20);
                        }
                    }
                },
                toolTip: "When someone with the stick joins, you get disconnected.",
            }),
        ],

        [ // Favorite Mods [11]
            new ButtonInfo({
                buttonText: "Exit Favorite Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
        ],
        
        [ // Enabled Mods [12]
            new ButtonInfo({
                buttonText: "Exit Enabled Mods",
                method: () => {                    
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
        ],

        [ // Credits [13]
            new ButtonInfo({
                buttonText: "Exit Credits",
                method: () => {                    
                    currentCategory = 0; currentPage = 0
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),

            new ButtonInfo({
                buttonText: "EyeCantSee",
                method: () => {                    
                    sendNotification("<color=red><b>EyeCa</b></color><color=blue><b>ntSee</b></color> <color=grey>--</color> <color=white>Owner of the Menu, Made All Of The Mods On It.</color>")
                },
                isTogglable: false,
                toolTip: "<color=red><b>EyeCa</b></color><color=blue><b>ntSee</b></color> <color=grey>--</color> <color=white>Owner of the Menu, Made All Of The Mods On It.</color>"
            }),

            new ButtonInfo({
                buttonText: "T3",
                method: () => {                    
                    sendNotification("<color=black><b>T</b></color><color=yellow><b>3</b></color> <color=grey>--</color> <color=white>Co-Owner of the Menu, Funded the project.</color>")
                },
                isTogglable: false,
                toolTip: "<color=black><b>T</b></color><color=yellow><b>3</b></color> <color=grey>--</color> <color=white>Co-Owner of the Menu, Funded the project.</color>"
            }),
        ]
    ];

    let buttonMap: Map<string, ButtonInfo> = new Map();
    buttons.flat().forEach(button => {
        buttonMap.set(button.buttonText, button);
    });

    // ===== Primal Contagion additions: HUD, settings, CS category, Platforms+, prefabs =====
    const HUD_SCALE = 0.1;
    const Camera = UnityEngineCore.class("UnityEngine.Camera");
    const LightClass = UnityEngineCore.class("UnityEngine.Light");
    const RenderSettings = UnityEngineCore.class("UnityEngine.RenderSettings");
    let csIndex = -1;
    const isModCat = (ci: number) => (ci >= 3 && ci <= 10) || (csIndex >= 0 && ci === csIndex);
    const pcFlag: any = {};
    const edge = (k: string, cur: boolean) => { const r = !!cur && !pcFlag[k]; pcFlag[k] = !!cur; return r; };
    const vec = (v: any): number[] => [Number(v.field("x").value), Number(v.field("y").value), Number(v.field("z").value)];
    const colArr = (c: any): number[] => [Number(c.field("r").value), Number(c.field("g").value), Number(c.field("b").value)];
    const pcErrAt: any = {};
    const pcLog = (k: string, e: any) => { if (!pcErrAt[k] || time - pcErrAt[k] > 10) { pcErrAt[k] = time; console.log("[pc] " + k + ": " + (e && e.message ? e.message : e)); } };
    const hsv = (h: number): number[] => { const f = (n: number) => { const k = (n + h * 6) % 6; return 1 - Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)]; };
    const getHeadT = (): any => {
        try { const h = getManager().field("Head").value; if (h && !h.isNull()) return h; } catch { }
        try { return Camera.method("get_main").invoke().method("get_transform").invoke(); } catch { }
        return getTransform(GTPlayerReal);
    };
    const getBodyT = (): any => { try { return getTransform(GTPlayerReal.field("bodyCollider").value); } catch { return getTransform(GTPlayerReal); } };
    const velNow = () => vec(rigidbody.method("get_velocity").invoke());
    const setV = (x: number, y: number, z: number) => rigidbody.method("set_velocity").invoke([x, y, z]);
    const headFwd = () => vec(getHeadT().method("get_forward").invoke());
    const playerPos = () => vec(getTransform(GTPlayerReal).method("get_position").invoke());
    const touching = () => { try { return !!GTPlayer.field("wasLeftHandTouching").value || !!GTPlayer.field("wasRightHandTouching").value; } catch { return false; } };
    const stick = (right: boolean) => { try { const v = EasyInputsClass.method("GetThumbStick2DAxis").invoke(right ? HAND_R : HAND_L); return [Number(v.field("x").value), Number(v.field("y").value)]; } catch { return [0, 0]; } };
    let opT = 0, opCache: any[] = [];
    const otherPlayers = (): any[] => {
        if (time < opT) return opCache;
        opT = time + 0.5;
        const out: any[] = [];
        try {
            const arr = Object.method("FindObjectsOfType").inflate(PhotonVRPlayerClass).invoke();
            for (let i = 0; i < arr.length; i++) { const p = arr.get(i); if (!playerIsLocal(p)) out.push(p); }
        } catch { }
        opCache = out;
        return out;
    };
    const playerHeadPos = (p: any): number[] => {
        try { const h = p.field("Head").value; if (h && !h.isNull()) return vec(h.method("get_position").invoke()); } catch { }
        return vec(getTransform(p).method("get_position").invoke());
    };
    const playerName = (p: any): string => {
        try { return String(p.method("get_photonView").invoke().method("get_Owner").invoke().method("get_NickName").invoke()).replace(/[<>]/g, ""); } catch { return "player"; }
    };
    const origVals: any = {};
    const keep = (f: string) => { if (!(f in origVals)) origVals[f] = GTPlayerReal.field(f).value; };
    const restore = (f: string) => { if (f in origVals) { try { GTPlayerReal.field(f).value = origVals[f]; } catch { } } };
    const pl = (f: string, v: any) => { try { GTPlayerReal.field(f).value = v; } catch { } };
    const safe = (fn: () => void) => { try { fn(); } catch (e: any) { pcLog("action", e); hudTag("ERROR", "red", (e && e.message ? e.message : String(e))); } };
    const quatE = (x: number, y: number, z: number) => Quaternion.method("Euler", 3).invoke(x, y, z);
    const relabel = (b: ButtonInfo, text: string) => { buttonMap.delete(b.buttonText); b.buttonText = text; buttonMap.set(text, b); };

    // =============================== settings ===============================
    // (SET / sv / saveSettings / loadSettings are generated further down)

    // =============================== HUD (iiDk-style: text only, [TAG] lines) ===============================
    const hudFeed: { text: string; t: number; ttl: number }[] = [];
    let hudRoot: any = null, hudTmp: any = null;
    let hudAlpha = 0, hudLastKey = "", hudNextDraw = 0, hudStatus = "", hudAlways = false, hudShowFps = false;
    let pollT = 0, prevRoom = "", prevConnected: any = null, prevActors: any = {}, lastRoomCode = "", hudFps = 60;

    function hudClean(t: string): string {
        return String(t).replace(/color=grey/g, "color=#8a8f98").replace(/color=gray/g, "color=#8a8f98").replace(/color=white/g, "color=#ffffff");
    }
    function hudPush(text: string, ttl: number = -1) {
        if (!text) return;
        if (ttl < 0) ttl = sv("hudTtl");
        text = hudClean(text);
        const last = hudFeed[hudFeed.length - 1];
        if (last && last.text === text && time - last.t < 1.0) return;
        hudFeed.push({ text, t: time, ttl });
        while (hudFeed.length > 10) hudFeed.shift();
    }
    function hudTag(tag: string, color: string, text: string, ttl: number = -1) {
        hudPush("<color=grey>[</color><color=" + color + ">" + tag + "</color><color=grey>]</color> " + text, ttl);
    }
    function hudBuild() {
        const headT = getHeadT();
        const pos = sv("hudPos");   // 0 bottom-left, 1 bottom-center, 2 top-left
        hudRoot = GameObject.new("PC_HUD");
        const rt = getTransform(hudRoot);
        rt.method("SetParent", 2).invoke(headT, false);
        rt.method("set_localPosition").invoke(pos === 2 ? [0, 0.1, 0.55] : [0, -0.2, 0.55]);
        rt.method("set_localRotation").invoke(identityQuaternion);
        rt.method("set_localScale").invoke(oneVector);
        const to = GameObject.new("PC_HUD_Text");
        const tt = getTransform(to);
        tt.method("SetParent", 2).invoke(rt, false);
        tt.method("set_localPosition").invoke([0, 0, 0]);
        tt.method("set_localRotation").invoke(identityQuaternion);
        tt.method("set_localScale").invoke([HUD_SCALE, HUD_SCALE, HUD_SCALE]);
        hudTmp = addComponent(to, TextMeshPro);
        hudTmp.method("set_fontSize").invoke(sv("hudSz"));
        try { hudTmp.method("set_richText").invoke(true); } catch { }
        try { hudTmp.method("set_alignment").invoke(pos === 0 ? 1025 : (pos === 1 ? 1026 : 257)); } catch { }
        try { hudTmp.method("set_enableWordWrapping").invoke(false); } catch { }
        try { hudTmp.method("set_overflowMode").invoke(0); } catch { }
        try { hudTmp.method("set_outlineWidth").invoke(0.22); } catch { }
        try { getComponent(to, RectTransform).method("set_sizeDelta").invoke([3.4, 1.7]); } catch { }
        try {
            const ov = Shader.method("Find").invoke(Il2Cpp.string("TextMeshPro/Distance Field Overlay"));
            if (ov && !ov.isNull()) hudTmp.method("get_fontMaterial").invoke().method("set_shader").invoke(ov);
        } catch { }
        hudLastKey = ""; hudAlpha = 0; pcFlag.hudShown = false;
    }
    function hudRebuild() { try { if (hudRoot) Destroy(hudRoot); } catch { } hudRoot = null; }
    function hudPoll() {
        if (time < pollT) return;
        pollT = time + 0.4;
        const connected = !!PhotonNetwork.method("get_IsConnected").invoke();
        const inRoom = connected && !!PhotonNetwork.method("get_InRoom").invoke();
        if (prevConnected !== null && connected !== prevConnected)
            hudTag("NET", connected ? "#6fdc8c" : "red", connected ? "Connected to Photon" : "Disconnected from Photon");
        prevConnected = connected;
        let room = "", count = 0, max = 0, ping = 0;
        const actors: any = {};
        if (inRoom) {
            const cr = PhotonNetwork.method("get_CurrentRoom").invoke();
            room = String(cr.method("get_Name").invoke());
            try { count = cr.method("get_PlayerCount").invoke(); max = cr.method("get_MaxPlayers").invoke(); } catch { }
            try { ping = PhotonNetwork.method("GetPing").invoke(); } catch { }
            try {
                const list = PhotonNetwork.method("get_PlayerList").invoke();
                for (let i = 0; i < list.length; i++) {
                    const p = list.get(i);
                    actors[p.method("get_ActorNumber").invoke()] = {
                        n: String(p.method("get_NickName").invoke()).replace(/[<>]/g, ""),
                        me: !!p.method("get_IsLocal").invoke(),
                    };
                }
            } catch { }
        }
        if (room !== prevRoom) {
            if (room) { hudTag("ROOM", "#6fdc8c", "Joined <b>" + room + "</b>", 7); lastRoomCode = room; }
            else if (prevRoom) hudTag("ROOM", "#ffb86b", "Left <b>" + prevRoom + "</b>", 7);
        } else if (inRoom) {
            for (const a in actors) if (!(a in prevActors) && !actors[a].me) hudTag("JOIN", "#7fd4ff", actors[a].n);
            for (const a in prevActors) if (!(a in actors)) hudTag("LEAVE", "#ff9bd0", prevActors[a].n);
        }
        prevActors = actors; prevRoom = room;
        hudStatus = inRoom
            ? "<color=grey>[</color><color=#7fd4ff>ROOM</color><color=grey>]</color> <b>" + room + "</b> <color=grey>-</color> " + count + "/" + max + " <color=grey>-</color> " + ping + " ms"
            : (connected ? "<color=grey>[</color><color=#ffb86b>NET</color><color=grey>]</color> Not in a room" : "<color=grey>[</color><color=red>NET</color><color=grey>]</color> Offline");
    }
    function hudRender() {
        if (hudRoot == null) hudBuild();
        const active = hudFeed.filter(f => time - f.t < f.ttl).slice(-sv("hudLines"));
        const target = (active.length > 0 || hudAlways) ? 1 : 0;
        hudAlpha += (target - hudAlpha) * Math.min(1, deltaTime * 9);
        if (Math.abs(target - hudAlpha) < 0.01) hudAlpha = target;
        hudFps += ((1 / Math.max(deltaTime, 0.0001)) - hudFps) * 0.05;
        if (hudAlpha <= 0.02) { if (pcFlag.hudShown) { hudRoot.method("SetActive").invoke(false); pcFlag.hudShown = false; } return; }
        if (!pcFlag.hudShown) { hudRoot.method("SetActive").invoke(true); pcFlag.hudShown = true; hudLastKey = ""; }
        if (time >= hudNextDraw) {
            hudNextDraw = time + 0.1;
            const lines: string[] = [];
            if (hudAlways || hudShowFps) lines.push(hudStatus + (hudShowFps ? " <color=grey>-</color> " + Math.round(hudFps) + " fps" : ""));
            for (const f of active) {
                const left = f.ttl - (time - f.t);
                const a = Math.max(0.2, Math.min(1, left / 0.8));
                lines.push("<alpha=#" + ("0" + Math.round(a * 255).toString(16)).slice(-2) + ">" + f.text);
            }
            const key = lines.join("\n");
            if (key !== hudLastKey) { hudLastKey = key; hudTmp.method("set_text").invoke(Il2Cpp.string(key)); }
        }
        const k = hudAlpha.toFixed(2);
        if (pcFlag.hudA !== k) { pcFlag.hudA = k; try { hudTmp.method("set_alpha").invoke(hudAlpha); } catch { } }
    }

    // ======================= saving enabled mods + settings =======================
    function savePersist() {
        const names: string[] = [];
        buttons.forEach((list, ci) => { if (isModCat(ci)) list.forEach(b => { if (b.enabled && b.isTogglable) names.push(b.buttonText); }); });
        PlayerPrefs.method("SetString").invoke(Il2Cpp.string("pc_enabled"), Il2Cpp.string(names.join("|")));
        PlayerPrefs.method("Save").invoke();
    }
    function saveSettings() {
        const o: any = {}; for (const k in SET) o[k] = SET[k].i;
        PlayerPrefs.method("SetString").invoke(Il2Cpp.string("pc_set"), Il2Cpp.string(JSON.stringify(o)));
        PlayerPrefs.method("Save").invoke();
    }
    function loadSettings() {
        const raw = String(PlayerPrefs.method("GetString", 2).invoke(Il2Cpp.string("pc_set"), Il2Cpp.string("")));
        if (!raw) return;
        const o = JSON.parse(raw);
        for (const k in o) if (SET[k] && o[k] >= 0 && o[k] < SET[k].n.length) { SET[k].i = o[k]; if (setBtns[k]) relabel(setBtns[k], SET[k].label + ": " + SET[k].n[SET[k].i]); }
        hudRebuild();
    }
    function restorePersist() {
        try { loadSettings(); } catch (e) { pcLog("loadSettings", e); }
        const raw = String(PlayerPrefs.method("GetString", 2).invoke(Il2Cpp.string("pc_enabled"), Il2Cpp.string("")));
        if (!raw) return;
        const want = raw.split("|");
        let n = 0;
        buttons.forEach((list, ci) => {
            if (!isModCat(ci)) return;
            list.forEach(b => {
                if (b.isTogglable && !b.enabled && want.includes(b.buttonText) && (b.method || b.enableMethod)) {
                    b.enabled = true; n++;
                    try { b.enableMethod?.(); } catch (e) { b.enabled = false; }
                }
            });
        });
        if (n) hudTag("INFO", "#7fd4ff", "Restored <b>" + n + "</b> saved mods");
    }

    // ============================= CS: sky / weather =============================
    let env: any = null, lightsCache: any[] = [], lightsT = 0;
    const lightOrig: any = {};
    const lightsList = (): any[] => {
        if (time > lightsT) {
            lightsT = time + 5; lightsCache = [];
            try { const arr = Object.method("FindObjectsOfType").inflate(LightClass).invoke(); for (let i = 0; i < arr.length; i++) lightsCache.push(arr.get(i)); } catch { }
        }
        return lightsCache;
    };
    function envCapture() {
        if (env) return;
        const cam = Camera.method("get_main").invoke();
        env = {
            mode: RenderSettings.method("get_ambientMode").invoke(), amb: colArr(RenderSettings.method("get_ambientLight").invoke()),
            fog: RenderSettings.method("get_fog").invoke(), fogCol: colArr(RenderSettings.method("get_fogColor").invoke()),
            fogDen: RenderSettings.method("get_fogDensity").invoke(), fogMode: RenderSettings.method("get_fogMode").invoke(),
            sky: RenderSettings.method("get_skybox").invoke(), flags: cam.method("get_clearFlags").invoke(), bg: colArr(cam.method("get_backgroundColor").invoke()),
        };
    }
    function envApply(amb: number[], fog: number, fogCol: number[], mult: number, hideSky: boolean, bg: number[]) {
        envCapture();
        RenderSettings.method("set_ambientMode").invoke(3);
        RenderSettings.method("set_ambientLight").invoke([amb[0], amb[1], amb[2], 1]);
        RenderSettings.method("set_fog").invoke(fog > 0);
        if (fog > 0) {
            RenderSettings.method("set_fogMode").invoke(3);
            RenderSettings.method("set_fogColor").invoke([fogCol[0], fogCol[1], fogCol[2], 1]);
            RenderSettings.method("set_fogDensity").invoke(fog);
        }
        for (const l of lightsList()) {
            try { const k = String(l.handle); if (!(k in lightOrig)) lightOrig[k] = l.method("get_intensity").invoke(); l.method("set_intensity").invoke(lightOrig[k] * mult); } catch { }
        }
        const cam = Camera.method("get_main").invoke();
        if (hideSky) {
            RenderSettings.method("set_skybox").invoke(null);
            cam.method("set_clearFlags").invoke(2); cam.method("set_backgroundColor").invoke([bg[0], bg[1], bg[2], 1]);
        } else {
            RenderSettings.method("set_skybox").invoke(env.sky); cam.method("set_clearFlags").invoke(env.flags);
        }
    }
    function envRestore() {
        if (!env) return;
        RenderSettings.method("set_ambientMode").invoke(env.mode);
        RenderSettings.method("set_ambientLight").invoke([env.amb[0], env.amb[1], env.amb[2], 1]);
        RenderSettings.method("set_fog").invoke(env.fog);
        RenderSettings.method("set_fogColor").invoke([env.fogCol[0], env.fogCol[1], env.fogCol[2], 1]);
        RenderSettings.method("set_fogDensity").invoke(env.fogDen); RenderSettings.method("set_fogMode").invoke(env.fogMode);
        RenderSettings.method("set_skybox").invoke(env.sky);
        const cam = Camera.method("get_main").invoke(); cam.method("set_clearFlags").invoke(env.flags); cam.method("set_backgroundColor").invoke([env.bg[0], env.bg[1], env.bg[2], 1]);
        for (const l of lightsList()) { try { const k = String(l.handle); if (k in lightOrig) l.method("set_intensity").invoke(lightOrig[k]); } catch { } }
    }
    let wxRoot: any = null, wxDrops: any[] = [], wxKind = "", wxStorm = false, wxFlashEnd = 0, wxNextFlash = 0, starRoot: any = null;
    function wxStop() { try { if (wxRoot) Destroy(wxRoot); } catch { } wxRoot = null; wxDrops = []; wxKind = ""; }
    function wxStart(kind: string) {
        wxStop(); wxKind = kind; wxRoot = GameObject.new("PC_WX");
        const rt = getTransform(wxRoot), rain = kind === "rain";
        for (let i = 0; i < sv("wxCount"); i++) {
            const o = GameObject.method("CreatePrimitive").invoke(rain ? 3 : 0);
            try { Destroy(getComponent(o, Collider)); } catch { }
            const t = getTransform(o); t.method("SetParent", 2).invoke(rt, false);
            t.method("set_localScale").invoke(rain ? [0.006, 0.3, 0.006] : [0.035, 0.035, 0.035]);
            const m = getComponent(o, Renderer).method("get_material").invoke(); m.method("set_shader").invoke(TextShader);
            m.method("set_color").invoke(rain ? [0.6, 0.7, 1, 0.5] : [1, 1, 1, 0.9]);
            const d = { t, x: (Math.random() - 0.5) * 10, y: Math.random() * 3.5 - 1.2, z: (Math.random() - 0.5) * 10, s: 0.8 + Math.random() * 0.4, ph: Math.random() * 6 };
            t.method("set_localPosition").invoke([d.x, d.y, d.z]); wxDrops.push(d);
        }
    }
    function starsStart() {
        starsStop(); starRoot = GameObject.new("PC_Stars");
        const rt = getTransform(starRoot);
        for (let i = 0; i < 70; i++) {
            const a = Math.random() * Math.PI * 2, e = 0.12 + Math.random() * 1.3, r = 80;
            const o = GameObject.method("CreatePrimitive").invoke(3); try { Destroy(getComponent(o, Collider)); } catch { }
            const t = getTransform(o); t.method("SetParent", 2).invoke(rt, false);
            t.method("set_localPosition").invoke([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r]);
            const s = 0.3 + Math.random() * 0.5; t.method("set_localScale").invoke([s, s, s]);
            const m = getComponent(o, Renderer).method("get_material").invoke(); m.method("set_shader").invoke(TextShader); m.method("set_color").invoke([1, 1, 0.9, 1]);
        }
    }
    function starsStop() { try { if (starRoot) Destroy(starRoot); } catch { } starRoot = null; }
    function wxTick() {
        if (wxRoot || starRoot) {
            const hp = vec(getHeadT().method("get_position").invoke());
            if (wxRoot) {
                getTransform(wxRoot).method("set_position").invoke(hp);
                const sp = sv("wxSpeed") * (wxKind === "rain" ? 1 : 0.18);
                for (let i = frameCount & 1; i < wxDrops.length; i += 2) {
                    const d = wxDrops[i]; d.y -= sp * d.s * deltaTime * 2;
                    if (d.y < -1.3) { d.y = 2.3; d.x = (Math.random() - 0.5) * 10; d.z = (Math.random() - 0.5) * 10; }
                    d.t.method("set_localPosition").invoke([d.x + (wxKind === "snow" ? Math.sin(time * 1.3 + d.ph) * 0.3 : 0), d.y, d.z]);
                }
            }
            if (starRoot && frameCount % 6 === 0) getTransform(starRoot).method("set_position").invoke(hp);
        }
        if (wxStorm) {
            if (time > wxNextFlash) { wxNextFlash = time + 3 + Math.random() * 7; wxFlashEnd = time + 0.12; RenderSettings.method("set_ambientLight").invoke([1, 1, 1, 1]); }
            else if (wxFlashEnd && time > wxFlashEnd) { wxFlashEnd = 0; RenderSettings.method("set_ambientLight").invoke([0.06, 0.07, 0.13, 1]); }
        }
    }

    // ============================= CS: rig objects (stick, wings...) =============================
    const csObjs: any = {};
    const csHas = (k: string) => !!csObjs[k];
    function csKill(k: string) { if (csObjs[k]) { try { Destroy(csObjs[k].root); } catch { } delete csObjs[k]; } }
    function csPart(rootT: any, prim: number, lpos: number[], euler: number[], lscale: number[], color: number[]) {
        const o = GameObject.method("CreatePrimitive").invoke(prim);
        try { Destroy(getComponent(o, Collider)); } catch { }
        const t = getTransform(o);
        t.method("SetParent", 2).invoke(rootT, false);
        t.method("set_localPosition").invoke(lpos); t.method("set_localRotation").invoke(quatE(euler[0], euler[1], euler[2])); t.method("set_localScale").invoke(lscale);
        const m = getComponent(o, Renderer).method("get_material").invoke(); m.method("set_shader").invoke(UberShader); m.method("set_color").invoke(color);
        return { o, t, m };
    }
    function csRoot(k: string, parentT: any) {
        csKill(k);
        const root = GameObject.new("PC_" + k); const rt = getTransform(root);
        rt.method("SetParent", 2).invoke(parentT, false); rt.method("set_localPosition").invoke([0, 0, 0]); rt.method("set_localRotation").invoke(identityQuaternion);
        csObjs[k] = { root, rt, parts: [] as any[] };
        return csObjs[k];
    }
    const STICK_COL: number[][] = [[0.45, 0.3, 0.15], [1, 0.8, 0.2], [0.1, 1, 0.9], [1, 1, 1]];
    function csStick() {
        const L = sv("stickLen"), c = csRoot("stick", rightHandTransform);
        c.parts.push(csPart(c.rt, 2, [0, 0, L / 2 + 0.04], [90, 0, 0], [0.02, L / 2, 0.02], STICK_COL[sv("stickStyle")].concat([1])));
    }
    function csHat() {
        const c = csRoot("hat", getHeadT());
        c.parts.push(csPart(c.rt, 2, [0, 0.24, 0], [0, 0, 0], [0.17, 0.1, 0.17], [0.05, 0.05, 0.05, 1]));
        c.parts.push(csPart(c.rt, 2, [0, 0.14, 0], [0, 0, 0], [0.3, 0.006, 0.3], [0.05, 0.05, 0.05, 1]));
        c.parts.push(csPart(c.rt, 2, [0, 0.16, 0], [0, 0, 0], [0.175, 0.02, 0.175], [0.8, 0.1, 0.1, 1]));
    }
    function csHalo() { const c = csRoot("halo", getHeadT()); c.parts.push(csPart(c.rt, 2, [0, 0.3, 0], [0, 0, 0], [0.26, 0.004, 0.26], [1, 0.85, 0.3, 1])); }
    function csAntenna() {
        const c = csRoot("antenna", getHeadT());
        c.parts.push(csPart(c.rt, 2, [0, 0.22, 0], [0, 0, 0], [0.012, 0.09, 0.012], [0.7, 0.7, 0.7, 1]));
        c.parts.push(csPart(c.rt, 0, [0, 0.33, 0], [0, 0, 0], [0.05, 0.05, 0.05], [1, 0.2, 0.2, 1]));
    }
    function csWings() {
        const c = csRoot("wings", getBodyT());
        c.parts.push(csPart(c.rt, 3, [-0.22, 0.1, -0.18], [0, 15, 20], [0.34, 0.01, 0.18], [1, 1, 1, 1]));
        c.parts.push(csPart(c.rt, 3, [0.22, 0.1, -0.18], [0, -15, -20], [0.34, 0.01, 0.18], [1, 1, 1, 1]));
    }
    function csTail() { const c = csRoot("tail", getBodyT()); c.parts.push(csPart(c.rt, 1, [0, -0.1, -0.22], [40, 0, 0], [0.05, 0.2, 0.05], [0.9, 0.5, 0.2, 1])); }
    function csOrbs() {
        const c = csRoot("orbs", leftHandTransform);
        c.parts.push(csPart(c.rt, 0, [0, 0, 0.05], [0, 0, 0], [0.07, 0.07, 0.07], [1, 1, 1, 1]));
        const r = csRoot("orbsR", rightHandTransform);
        r.parts.push(csPart(r.rt, 0, [0, 0, 0.05], [0, 0, 0], [0.07, 0.07, 0.07], [1, 1, 1, 1]));
    }
    function csTick() {
        if (csObjs.stick && sv("stickStyle") === 3) csObjs.stick.parts[0].m.method("set_color").invoke(hsv((time * 0.3) % 1).concat([1]));
        if (csObjs.halo) csObjs.halo.rt.method("set_localRotation").invoke(quatE(0, time * 60, 0));
        if (csObjs.wings) {
            const f = Math.sin(time * 7) * 28;
            csObjs.wings.parts[0].t.method("set_localRotation").invoke(quatE(0, 15, 20 + f)); csObjs.wings.parts[1].t.method("set_localRotation").invoke(quatE(0, -15, -20 - f));
        }
        if (csObjs.tail) csObjs.tail.parts[0].t.method("set_localRotation").invoke(quatE(40, Math.sin(time * 5) * 25, 0));
        if (csObjs.antenna) csObjs.antenna.parts[1].m.method("set_color").invoke(Math.sin(time * 6) > 0 ? [1, 0.2, 0.2, 1] : [0.3, 0, 0, 1]);
        if (csObjs.orbs || csObjs.orbsR) {
            const c = hsv((time * 0.4) % 1).concat([1]);
            if (csObjs.orbs) csObjs.orbs.parts[0].m.method("set_color").invoke(c);
            if (csObjs.orbsR) csObjs.orbsR.parts[0].m.method("set_color").invoke(c);
        }
    }

    // ============================= CS: cosmetics (client-side only) =============================
    const COS = [["Head", "HeadCosmetics"], ["Face", "FaceCosmetics"], ["Body", "BodyCosmetics"], ["Left Hand", "LeftHandCosmetics"], ["Right Hand", "RightHandCosmetics"]];
    const cosIdx = [-1, -1, -1, -1, -1];
    function cosCycle(slot: number) {
        const lp = getLocalPlayer(); if (!lp) { hudTag("CS", "#ffb86b", "No local rig yet"); return; }
        const t = lp.field(COS[slot][1]).value, n = t.method("get_childCount").invoke();
        if (!n) { hudTag("CS", "#ffb86b", COS[slot][0] + ": no cosmetics found"); return; }
        cosIdx[slot] = cosIdx[slot] + 1 >= n ? -1 : cosIdx[slot] + 1;
        let nm = "none";
        for (let i = 0; i < n; i++) {
            const g = t.method("GetChild").invoke(i).method("get_gameObject").invoke();
            g.method("SetActive").invoke(i === cosIdx[slot]);
            if (i === cosIdx[slot]) nm = String(g.method("get_name").invoke());
        }
        hudTag("CS", "#c792ff", COS[slot][0] + ": <b>" + nm + "</b> (" + (cosIdx[slot] + 1) + "/" + n + ")");
    }
    function cosAll(on: boolean) {
        const lp = getLocalPlayer(); if (!lp) return;
        for (let s = 0; s < COS.length; s++) {
            const t = lp.field(COS[s][1]).value, n = t.method("get_childCount").invoke();
            for (let i = 0; i < n; i++) t.method("GetChild").invoke(i).method("get_gameObject").invoke().method("SetActive").invoke(on);
            cosIdx[s] = on ? n - 1 : -1;
        }
        hudTag("CS", "#c792ff", on ? "All cosmetics shown" : "All cosmetics hidden");
    }

    // ============================= Platforms+ =============================
    const PF_COL: number[][] = [[1, 1, 1], [1, 0.1, 0.1], [1, 0.55, 0.05], [0.1, 0.9, 0.2], [0.1, 0.9, 0.95], [0.15, 0.3, 1], [1, 0.4, 0.75], [0.03, 0.03, 0.03], [1, 0.8, 0.2]];
    let pfL: any = null, pfR: any = null;
    const pfBase = (): number[] => (sv("pfColor") === 0 ? [bgColor[0], bgColor[1], bgColor[2]] : PF_COL[sv("pfColor") - 1]);
    function pfMake(handT: any) {
        const st = sv("pfStyle"), size = sv("pfSize"), shape = st === 3 ? 0 : sv("pfShape");
        const b = pfBase();
        let scale = [0.025 * size, 0.15 * size, 0.2 * size], col = [b[0], b[1], b[2], 1];
        if (st === 3) { scale = [0.05 * size, 0.2 * size, 0.3 * size]; col = [1, 1, 1, 1]; }
        if (st === 2) col = [0, 0, 0, 0];
        const o = createObject(handT.method("get_position").invoke(), handT.method("get_rotation").invoke(), scale, shape, col as [number, number, number, number]);
        if (st === 4) { const m = getComponent(o, Renderer).method("get_material").invoke(); m.method("set_shader").invoke(TextShader); m.method("set_color").invoke([b[0], b[1], b[2], 0.3]); }
        if (st === 3) {
            for (const p of [[0, 0.06, 0.1, 0.7], [0, -0.05, -0.12, 0.65], [0, 0.04, -0.02, 0.6]]) {
                const puff = GameObject.method("CreatePrimitive").invoke(0); try { Destroy(getComponent(puff, Collider)); } catch { }
                const t = getTransform(puff); t.method("SetParent", 2).invoke(getTransform(o), false);
                t.method("set_localPosition").invoke([p[0], p[1], p[2]]); t.method("set_localScale").invoke([p[3], p[3], p[3]]);
                const m = getComponent(puff, Renderer).method("get_material").invoke(); m.method("set_shader").invoke(UberShader); m.method("set_color").invoke([1, 1, 1, 1]);
            }
        }
        return o;
    }
    function pfStyleTick(o: any, i: number) {
        if (!o) return;
        const st = sv("pfStyle");
        if (st !== 1 && st !== 5) return;
        const m = getComponent(o, Renderer).method("get_material").invoke();
        if (st === 1) { const c = hsv((time * 0.25 + i * 0.5) % 1); m.method("set_color").invoke([c[0], c[1], c[2], 1]); }
        else { const b = pfBase(), a = 0.55 + 0.45 * Math.sin(time * 4 + i); m.method("set_color").invoke([b[0] * a, b[1] * a, b[2] * a, 1]); }
    }
    function pfKill() { if (pfL) { Destroy(pfL); pfL = null; } if (pfR) { Destroy(pfR); pfR = null; } }

    // ============================= prefab spawner =============================
    let prefabs: any[] = [], prefabNames: string[] = [], prefabIdx = 0, spawned: any[] = [];
    function prefabLoad() {
        prefabs = []; prefabNames = [];
        const arr = Resources.method("LoadAll", 2).invoke(Il2Cpp.string(""), GameObject.type.object);
        for (let i = 0; i < arr.length; i++) { const o = arr.get(i); prefabs.push(o); prefabNames.push(String(o.method("get_name").invoke())); }
        prefabIdx = 0;
        hudTag("PREFAB", "#7fd4ff", prefabs.length + " prefabs in Resources" + (prefabs.length ? " - selected <b>" + prefabNames[0] + "</b>" : ""));
    }
    function prefabStep(d: number) {
        if (!prefabs.length) prefabLoad();
        if (!prefabs.length) return;
        prefabIdx = (prefabIdx + d + prefabs.length) % prefabs.length;
        hudTag("PREFAB", "#7fd4ff", "<b>" + prefabNames[prefabIdx] + "</b> (" + (prefabIdx + 1) + "/" + prefabs.length + ")");
    }
    function spawnPoint(): number[] { const f = headFwd(), p = vec(getHeadT().method("get_position").invoke()); return [p[0] + f[0] * 1.3, p[1] - 0.2, p[2] + f[2] * 1.3]; }
    function spawnLocalIdx(idx: number) {
        const g = Object.method("Instantiate").overload("UnityEngine.Object", "UnityEngine.Vector3", "UnityEngine.Quaternion").invoke(prefabs[idx], spawnPoint(), identityQuaternion);
        spawned.push({ go: g, net: false }); hudTag("SPAWN", "#6fdc8c", "<b>" + prefabNames[idx] + "</b> (local)");
    }
    function spawnNet(name: string) {
        if (!PhotonNetwork.method("get_InRoom").invoke()) { hudTag("SPAWN", "#ffb86b", "Join a room first"); return; }
        if (time < (pcFlag.spawnT || 0)) { hudTag("SPAWN", "#ffb86b", "Slow down"); return; }
        pcFlag.spawnT = time + 1.5;
        const g = PhotonNetwork.method("Instantiate", 5).invoke(Il2Cpp.string(name), spawnPoint(), identityQuaternion, 0, null);
        spawned.push({ go: g, net: true }); hudTag("SPAWN", "#6fdc8c", "<b>" + name + "</b> (networked)");
    }
    function prefabFind(sub: string): number {
        if (!prefabs.length) prefabLoad();
        return prefabNames.findIndex(n => n.toLowerCase().indexOf(sub.toLowerCase()) >= 0);
    }
    function spawnDelete() {
        let n = 0;
        for (const s of spawned) { try { if (s.net) PhotonNetwork.method("Destroy").overload("UnityEngine.GameObject").invoke(s.go); else Destroy(s.go); n++; } catch { } }
        spawned = []; hudTag("SPAWN", "#ffb86b", "Removed " + n + " spawned objects");
    }

    function hudTick() {
        try { hudPoll(); } catch (e) { pcLog("hudPoll", e); }
        try { hudRender(); } catch (e) { pcLog("hudRender", e); hudRoot = null; pcFlag.hudShown = false; }
        try { wxTick(); } catch (e) { pcLog("weather", e); }
        try { csTick(); } catch (e) { pcLog("cs", e); }
        if (frameCount === 150) { try { restorePersist(); } catch (e) { pcLog("restore", e); } }
    }


    // ============================ generated: settings + buttons ============================
    const SET: any = {
        pfShape: { label: "Platform Shape", i: 0, n: ["Cube", "Sphere", "Cylinder", "Capsule"], v: [3, 0, 2, 1] },
        pfStyle: { label: "Platform Style", i: 0, n: ["Solid", "Rainbow", "Invisible", "Cloud", "Glass", "Pulse"], v: [0, 1, 2, 3, 4, 5] },
        pfSize: { label: "Platform Size", i: 2, n: ["0.5x", "0.75x", "1x", "1.5x", "2x", "3x"], v: [0.5, 0.75, 1, 1.5, 2, 3] },
        pfColor: { label: "Platform Color", i: 0, n: ["Menu", "White", "Red", "Orange", "Green", "Cyan", "Blue", "Pink", "Black", "Gold"], v: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
        pfBtn: { label: "Platform Button", i: 0, n: ["Grip", "Trigger"], v: [0, 1] },
        hudPos: { label: "HUD Position", i: 0, n: ["Bottom Left", "Bottom Center", "Top Left"], v: [0, 1, 2] },
        hudLines: { label: "HUD Lines", i: 1, n: ["3", "5", "7"], v: [3, 5, 7] },
        hudTtl: { label: "HUD Duration", i: 1, n: ["3s", "5s", "8s", "12s"], v: [3, 5, 8, 12] },
        hudSz: { label: "HUD Size", i: 1, n: ["Small", "Normal", "Large"], v: [1.5, 2.0, 2.8] },
        dashPower: { label: "Dash Power", i: 1, n: ["8", "14", "22", "35"], v: [8, 14, 22, 35] },
        jumpBoost: { label: "Super Jump Power", i: 1, n: ["1.6x", "2.5x", "4x"], v: [1.6, 2.5, 4.0] },
        rampMax: { label: "Speed Ramp Max", i: 1, n: ["2x", "2.5x", "4x"], v: [2.0, 2.5, 4.0] },
        grappleSpeed: { label: "Grapple Speed", i: 1, n: ["12", "18", "30"], v: [12, 18, 30] },
        trampPower: { label: "Bounce Power", i: 1, n: ["6", "8", "12"], v: [6, 8, 12] },
        runSpeed: { label: "Auto Run Speed", i: 1, n: ["5", "7", "10", "14"], v: [5, 7, 10, 14] },
        stickLen: { label: "Stick Length", i: 1, n: ["0.6m", "1m", "1.5m", "2.5m"], v: [0.6, 1.0, 1.5, 2.5] },
        stickStyle: { label: "Stick Style", i: 0, n: ["Wood", "Gold", "Neon", "Rainbow"], v: [0, 1, 2, 3] },
        wxCount: { label: "Weather Amount", i: 1, n: ["Light", "Normal", "Heavy"], v: [28, 56, 90] },
        wxSpeed: { label: "Weather Speed", i: 1, n: ["Slow", "Normal", "Fast"], v: [6, 10, 16] },
    };
    const sv = (k: string): any => SET[k].v[SET[k].i];
    const setBtns: any = {};
    const catFallback: any = { movement: 3, fun: 4, advantage: 5, misc: 7, visual: 8, safety: 10, settings: 2 };
    const addTo = (anchor: string, fb: string, list: ButtonInfo[]) => {
        const a = buttons.flat().find(b => b.buttonText == anchor);
        let cat = a ? buttons.find(c => c.includes(a)) : null;
        if (!cat) cat = buttons[catFallback[fb]];
        cat.splice(1, 0, ...list);
    };
            const s_pfShape = new ButtonInfo({
                buttonText: "Platform Shape: Cube",
                method: () => {
                    SET.pfShape.i = (SET.pfShape.i + 1) % SET.pfShape.n.length;
                    relabel(s_pfShape, SET.pfShape.label + ": " + SET.pfShape.n[SET.pfShape.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.pfShape.label + ": <b>" + SET.pfShape.n[SET.pfShape.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Shape used by Platforms+. (press to cycle)"
            });
    setBtns.pfShape = s_pfShape;
            const s_pfStyle = new ButtonInfo({
                buttonText: "Platform Style: Solid",
                method: () => {
                    SET.pfStyle.i = (SET.pfStyle.i + 1) % SET.pfStyle.n.length;
                    relabel(s_pfStyle, SET.pfStyle.label + ": " + SET.pfStyle.n[SET.pfStyle.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.pfStyle.label + ": <b>" + SET.pfStyle.n[SET.pfStyle.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Look of Platforms+ (Cloud forces the cloud shape, Invisible keeps the collider). (press to cycle)"
            });
    setBtns.pfStyle = s_pfStyle;
            const s_pfSize = new ButtonInfo({
                buttonText: "Platform Size: 1x",
                method: () => {
                    SET.pfSize.i = (SET.pfSize.i + 1) % SET.pfSize.n.length;
                    relabel(s_pfSize, SET.pfSize.label + ": " + SET.pfSize.n[SET.pfSize.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.pfSize.label + ": <b>" + SET.pfSize.n[SET.pfSize.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Size of Platforms+. (press to cycle)"
            });
    setBtns.pfSize = s_pfSize;
            const s_pfColor = new ButtonInfo({
                buttonText: "Platform Color: Menu",
                method: () => {
                    SET.pfColor.i = (SET.pfColor.i + 1) % SET.pfColor.n.length;
                    relabel(s_pfColor, SET.pfColor.label + ": " + SET.pfColor.n[SET.pfColor.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.pfColor.label + ": <b>" + SET.pfColor.n[SET.pfColor.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Colour of Platforms+. (press to cycle)"
            });
    setBtns.pfColor = s_pfColor;
            const s_pfBtn = new ButtonInfo({
                buttonText: "Platform Button: Grip",
                method: () => {
                    SET.pfBtn.i = (SET.pfBtn.i + 1) % SET.pfBtn.n.length;
                    relabel(s_pfBtn, SET.pfBtn.label + ": " + SET.pfBtn.n[SET.pfBtn.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.pfBtn.label + ": <b>" + SET.pfBtn.n[SET.pfBtn.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Which button spawns Platforms+. (press to cycle)"
            });
    setBtns.pfBtn = s_pfBtn;
            const s_hudPos = new ButtonInfo({
                buttonText: "HUD Position: Bottom Left",
                method: () => {
                    SET.hudPos.i = (SET.hudPos.i + 1) % SET.hudPos.n.length;
                    relabel(s_hudPos, SET.hudPos.label + ": " + SET.hudPos.n[SET.hudPos.i]);
                    hudRebuild();
                    saveSettings(); hudTag("SET", "#c792ff", SET.hudPos.label + ": <b>" + SET.hudPos.n[SET.hudPos.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Where the notification HUD sits. (press to cycle)"
            });
    setBtns.hudPos = s_hudPos;
            const s_hudLines = new ButtonInfo({
                buttonText: "HUD Lines: 5",
                method: () => {
                    SET.hudLines.i = (SET.hudLines.i + 1) % SET.hudLines.n.length;
                    relabel(s_hudLines, SET.hudLines.label + ": " + SET.hudLines.n[SET.hudLines.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.hudLines.label + ": <b>" + SET.hudLines.n[SET.hudLines.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "How many notification lines the HUD shows. (press to cycle)"
            });
    setBtns.hudLines = s_hudLines;
            const s_hudTtl = new ButtonInfo({
                buttonText: "HUD Duration: 5s",
                method: () => {
                    SET.hudTtl.i = (SET.hudTtl.i + 1) % SET.hudTtl.n.length;
                    relabel(s_hudTtl, SET.hudTtl.label + ": " + SET.hudTtl.n[SET.hudTtl.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.hudTtl.label + ": <b>" + SET.hudTtl.n[SET.hudTtl.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "How long notifications stay. (press to cycle)"
            });
    setBtns.hudTtl = s_hudTtl;
            const s_hudSz = new ButtonInfo({
                buttonText: "HUD Size: Normal",
                method: () => {
                    SET.hudSz.i = (SET.hudSz.i + 1) % SET.hudSz.n.length;
                    relabel(s_hudSz, SET.hudSz.label + ": " + SET.hudSz.n[SET.hudSz.i]);
                    hudRebuild();
                    saveSettings(); hudTag("SET", "#c792ff", SET.hudSz.label + ": <b>" + SET.hudSz.n[SET.hudSz.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Text size of the HUD. (press to cycle)"
            });
    setBtns.hudSz = s_hudSz;
            const s_dashPower = new ButtonInfo({
                buttonText: "Dash Power: 14",
                method: () => {
                    SET.dashPower.i = (SET.dashPower.i + 1) % SET.dashPower.n.length;
                    relabel(s_dashPower, SET.dashPower.label + ": " + SET.dashPower.n[SET.dashPower.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.dashPower.label + ": <b>" + SET.dashPower.n[SET.dashPower.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Speed of Air Dash. (press to cycle)"
            });
    setBtns.dashPower = s_dashPower;
            const s_jumpBoost = new ButtonInfo({
                buttonText: "Super Jump Power: 2.5x",
                method: () => {
                    SET.jumpBoost.i = (SET.jumpBoost.i + 1) % SET.jumpBoost.n.length;
                    relabel(s_jumpBoost, SET.jumpBoost.label + ": " + SET.jumpBoost.n[SET.jumpBoost.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.jumpBoost.label + ": <b>" + SET.jumpBoost.n[SET.jumpBoost.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Strength of Super Jump. (press to cycle)"
            });
    setBtns.jumpBoost = s_jumpBoost;
            const s_rampMax = new ButtonInfo({
                buttonText: "Speed Ramp Max: 2.5x",
                method: () => {
                    SET.rampMax.i = (SET.rampMax.i + 1) % SET.rampMax.n.length;
                    relabel(s_rampMax, SET.rampMax.label + ": " + SET.rampMax.n[SET.rampMax.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.rampMax.label + ": <b>" + SET.rampMax.n[SET.rampMax.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Top speed multiplier of Speed Ramp. (press to cycle)"
            });
    setBtns.rampMax = s_rampMax;
            const s_grappleSpeed = new ButtonInfo({
                buttonText: "Grapple Speed: 18",
                method: () => {
                    SET.grappleSpeed.i = (SET.grappleSpeed.i + 1) % SET.grappleSpeed.n.length;
                    relabel(s_grappleSpeed, SET.grappleSpeed.label + ": " + SET.grappleSpeed.n[SET.grappleSpeed.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.grappleSpeed.label + ": <b>" + SET.grappleSpeed.n[SET.grappleSpeed.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Pull speed of the Grapple Gun. (press to cycle)"
            });
    setBtns.grappleSpeed = s_grappleSpeed;
            const s_trampPower = new ButtonInfo({
                buttonText: "Bounce Power: 8",
                method: () => {
                    SET.trampPower.i = (SET.trampPower.i + 1) % SET.trampPower.n.length;
                    relabel(s_trampPower, SET.trampPower.label + ": " + SET.trampPower.n[SET.trampPower.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.trampPower.label + ": <b>" + SET.trampPower.n[SET.trampPower.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Strength of Trampoline. (press to cycle)"
            });
    setBtns.trampPower = s_trampPower;
            const s_runSpeed = new ButtonInfo({
                buttonText: "Auto Run Speed: 7",
                method: () => {
                    SET.runSpeed.i = (SET.runSpeed.i + 1) % SET.runSpeed.n.length;
                    relabel(s_runSpeed, SET.runSpeed.label + ": " + SET.runSpeed.n[SET.runSpeed.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.runSpeed.label + ": <b>" + SET.runSpeed.n[SET.runSpeed.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Speed of Auto Run. (press to cycle)"
            });
    setBtns.runSpeed = s_runSpeed;
            const s_stickLen = new ButtonInfo({
                buttonText: "Stick Length: 1m",
                method: () => {
                    SET.stickLen.i = (SET.stickLen.i + 1) % SET.stickLen.n.length;
                    relabel(s_stickLen, SET.stickLen.label + ": " + SET.stickLen.n[SET.stickLen.i]);
                    if (csHas("stick")) csStick();
                    saveSettings(); hudTag("SET", "#c792ff", SET.stickLen.label + ": <b>" + SET.stickLen.n[SET.stickLen.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Length of the CS Stick. (press to cycle)"
            });
    setBtns.stickLen = s_stickLen;
            const s_stickStyle = new ButtonInfo({
                buttonText: "Stick Style: Wood",
                method: () => {
                    SET.stickStyle.i = (SET.stickStyle.i + 1) % SET.stickStyle.n.length;
                    relabel(s_stickStyle, SET.stickStyle.label + ": " + SET.stickStyle.n[SET.stickStyle.i]);
                    if (csHas("stick")) csStick();
                    saveSettings(); hudTag("SET", "#c792ff", SET.stickStyle.label + ": <b>" + SET.stickStyle.n[SET.stickStyle.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "Look of the CS Stick. (press to cycle)"
            });
    setBtns.stickStyle = s_stickStyle;
            const s_wxCount = new ButtonInfo({
                buttonText: "Weather Amount: Normal",
                method: () => {
                    SET.wxCount.i = (SET.wxCount.i + 1) % SET.wxCount.n.length;
                    relabel(s_wxCount, SET.wxCount.label + ": " + SET.wxCount.n[SET.wxCount.i]);
                    if (wxKind) wxStart(wxKind);
                    saveSettings(); hudTag("SET", "#c792ff", SET.wxCount.label + ": <b>" + SET.wxCount.n[SET.wxCount.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "How many drops/flakes CS Rain and CS Snow use. (press to cycle)"
            });
    setBtns.wxCount = s_wxCount;
            const s_wxSpeed = new ButtonInfo({
                buttonText: "Weather Speed: Normal",
                method: () => {
                    SET.wxSpeed.i = (SET.wxSpeed.i + 1) % SET.wxSpeed.n.length;
                    relabel(s_wxSpeed, SET.wxSpeed.label + ": " + SET.wxSpeed.n[SET.wxSpeed.i]);

                    saveSettings(); hudTag("SET", "#c792ff", SET.wxSpeed.label + ": <b>" + SET.wxSpeed.n[SET.wxSpeed.i] + "</b>"); reloadMenu();
                },
                isTogglable: false,
                toolTip: "How fast drops/flakes fall. (press to cycle)"
            });
    setBtns.wxSpeed = s_wxSpeed;
    addTo("Image as Background", "settings", [s_pfShape, s_pfStyle, s_pfSize, s_pfColor, s_pfBtn, s_hudPos, s_hudLines, s_hudTtl, s_hudSz, s_dashPower, s_jumpBoost, s_rampMax, s_grappleSpeed, s_trampPower, s_runSpeed, s_stickLen, s_stickStyle, s_wxCount, s_wxSpeed]);

    addTo("Platforms", "movement", [
            new ButtonInfo({
                buttonText: "Platforms+",
                enabled: false,
                method: () => {
                    const L = sv("pfBtn") === 0 ? leftGrab : leftTrigger, R = sv("pfBtn") === 0 ? rightGrab : rightTrigger;
                    if (L) { if (pfL == null) pfL = pfMake(leftHandTransform); } else if (pfL != null) { Destroy(pfL); pfL = null; }
                    if (R) { if (pfR == null) pfR = pfMake(rightHandTransform); } else if (pfR != null) { Destroy(pfR); pfR = null; }
                    pfStyleTick(pfL, 0); pfStyleTick(pfR, 1);
                },
                disableMethod: () => {
                    pfKill();
                },
                toolTip: "Platforms with settings: shape, style (rainbow / invisible / cloud / glass / pulse), size and colour. Configure them in Settings."
            }),
            new ButtonInfo({
                buttonText: "Super Jump",
                enabled: false,
                method: () => {
                    pl("jumpMultiplier", sv("jumpBoost")); pl("maxJumpSpeed", 12.0);
                },
                enableMethod: () => {
                    keep("jumpMultiplier"); keep("maxJumpSpeed");
                },
                disableMethod: () => {
                    restore("jumpMultiplier"); restore("maxJumpSpeed");
                },
                toolTip: "Higher jumps (power in Settings)."
            }),
            new ButtonInfo({
                buttonText: "No Velocity Cap",
                enabled: false,
                method: () => {
                    pl("velocityLimit", 50.0);
                },
                enableMethod: () => {
                    keep("velocityLimit");
                },
                disableMethod: () => {
                    restore("velocityLimit");
                },
                toolTip: "Removes the speed limit on hand-push velocity."
            }),
            new ButtonInfo({
                buttonText: "Reach Arms",
                enabled: false,
                method: () => {
                    pl("maxArmLength", 1.3);
                },
                enableMethod: () => {
                    keep("maxArmLength");
                },
                disableMethod: () => {
                    restore("maxArmLength");
                },
                toolTip: "Your hands reach further before detaching."
            }),
            new ButtonInfo({
                buttonText: "Hover (hold B)",
                enabled: false,
                method: () => {
                    if (rightSecondary) setV(0, 0, 0);
                },
                toolTip: "Freezes your velocity while holding B."
            }),
            new ButtonInfo({
                buttonText: "Freeze Movement",
                enabled: false,
                enableMethod: () => {
                    pl("disableMovement", true);
                },
                disableMethod: () => {
                    pl("disableMovement", false);
                },
                toolTip: "Stops the locomotion script from moving you."
            }),
            new ButtonInfo({
                buttonText: "Air Dash [L Trigger]",
                enabled: false,
                method: () => {
                    if (edge("dash", leftTrigger)) { const f = headFwd(), p = sv("dashPower"); setV(f[0] * p, f[1] * p, f[2] * p); }
                },
                toolTip: "Dash where you look with the left trigger (power in Settings)."
            }),
            new ButtonInfo({
                buttonText: "Air Jump [A]",
                enabled: false,
                method: () => {
                    if (touching()) pcFlag.airJumps = 2;
                    else if (edge("airjump", rightPrimary) && (pcFlag.airJumps ?? 2) > 0) { pcFlag.airJumps = (pcFlag.airJumps ?? 2) - 1; const v = velNow(); setV(v[0], 7.0, v[2]); }
                    else if (!rightPrimary) pcFlag.airjump = false;
                },
                toolTip: "Two extra jumps in the air with A."
            }),
            new ButtonInfo({
                buttonText: "Bunny Hop",
                enabled: false,
                method: () => {
                    if (touching() && rightPrimary && time > (pcFlag.bhopT || 0)) {
                        pcFlag.bhopT = time + 0.3; const v = velNow(), f = headFwd();
                        setV(v[0] + f[0] * 1.6, 6.5, v[2] + f[2] * 1.6);
                    }
                },
                toolTip: "Hold A while touching the ground to chain hops and gain speed."
            }),
            new ButtonInfo({
                buttonText: "Glide (both grips)",
                enabled: false,
                method: () => {
                    if (leftGrab && rightGrab && !touching()) {
                        const v = velNow(), f = headFwd();
                        setV(v[0] + f[0] * 0.2, Math.max(v[1], -1.2), v[2] + f[2] * 0.2);
                    }
                },
                toolTip: "Hold both grips in the air to glide forward."
            }),
            new ButtonInfo({
                buttonText: "Wall Cling (hold B)",
                enabled: false,
                method: () => {
                    if (rightSecondary && touching()) setV(0, 0, 0);
                },
                toolTip: "Hold B while touching something to stick to it."
            }),
            new ButtonInfo({
                buttonText: "Auto Run (L grip)",
                enabled: false,
                method: () => {
                    if (leftGrab) { const f = headFwd(), v = velNow(), n = Math.hypot(f[0], f[2]) || 1, s = sv("runSpeed"); setV(f[0] / n * s, v[1], f[2] / n * s); }
                },
                toolTip: "Hold the left grip to run where you look (speed in Settings)."
            }),
            new ButtonInfo({
                buttonText: "Speed Ramp",
                enabled: false,
                method: () => {
                    const v = velNow(), s = Math.hypot(v[0], v[2]);
                    pcFlag.ramp = s > 1.5 ? Math.min(sv("rampMax"), (pcFlag.ramp || 1) + deltaTime * 0.5) : 1;
                    pl("jumpMultiplier", 1.1 * pcFlag.ramp); pl("maxJumpSpeed", 6.5 * pcFlag.ramp);
                },
                enableMethod: () => {
                    keep("jumpMultiplier"); keep("maxJumpSpeed"); pcFlag.ramp = 1;
                },
                disableMethod: () => {
                    restore("jumpMultiplier"); restore("maxJumpSpeed");
                },
                toolTip: "The longer you keep moving, the faster you get."
            }),
            new ButtonInfo({
                buttonText: "Grapple Gun",
                enabled: false,
                method: () => {
                    if (rightGrab) {
                        const g = renderGun();
                        const p = vec(getTransform(g.gunPointer).method("get_position").invoke());
                        if (rightTrigger) {
                            const me = playerPos(), d = [p[0] - me[0], p[1] - me[1], p[2] - me[2]], L = Math.hypot(d[0], d[1], d[2]), s = sv("grappleSpeed");
                            if (L > 1.2) setV(d[0] / L * s, d[1] / L * s, d[2] / L * s); else setV(0, 0, 0);
                        }
                    }
                },
                toolTip: "Hold right grip to aim, squeeze the trigger to pull yourself to the point."
            }),
            new ButtonInfo({
                buttonText: "Rewind (hold X)",
                enabled: false,
                method: () => {
                    const buf: number[][] = pcFlag.rew || (pcFlag.rew = []);
                    if (leftPrimary && buf.length > 3) {
                        for (let i = 0; i < 2; i++) { const q = buf.pop(); if (q) getTransform(GTPlayerReal).method("set_position").invoke(q); }
                        setV(0, 0, 0);
                    } else { buf.push(playerPos()); if (buf.length > 420) buf.shift(); }
                },
                enableMethod: () => {
                    pcFlag.rew = [];
                },
                toolTip: "Hold X to travel back along your last few seconds."
            }),
            new ButtonInfo({
                buttonText: "Trampoline",
                enabled: false,
                method: () => {
                    if (touching() && time > (pcFlag.trampT || 0)) { pcFlag.trampT = time + 0.25; const v = velNow(); setV(v[0], sv("trampPower"), v[2]); }
                },
                toolTip: "Bounce every time you touch a surface (power in Settings)."
            }),
            new ButtonInfo({
                buttonText: "Moon Gravity",
                enabled: false,
                method: () => {
                    const v = velNow(); setV(v[0], v[1] + 6.5 * deltaTime, v[2]);
                },
                toolTip: "Floaty low gravity."
            }),
            new ButtonInfo({
                buttonText: "Fling (L grip)",
                enabled: false,
                method: () => {
                    if (edge("fling", leftGrab)) { const f = headFwd(), v = velNow(); setV(v[0] + f[0] * 25, v[1] + f[1] * 25, v[2] + f[2] * 25); }
                },
                toolTip: "Squeeze the left grip to fling yourself where you look."
            }),
            new ButtonInfo({
                buttonText: "Jetpack (hold B)",
                enabled: false,
                method: () => {
                    if (rightSecondary) { const v = velNow(), f = headFwd(); setV(v[0] + f[0] * 4 * deltaTime, Math.min(v[1] + 16 * deltaTime, 8), v[2] + f[2] * 4 * deltaTime); }
                },
                toolTip: "Hold B to fly up and forward."
            }),
            new ButtonInfo({
                buttonText: "Rocket Hands (R grip)",
                enabled: false,
                method: () => {
                    if (rightGrab) { const f = vec(rightHandTransform.method("get_forward").invoke()), v = velNow(); setV(v[0] + f[0] * 22 * deltaTime, v[1] + f[1] * 22 * deltaTime, v[2] + f[2] * 22 * deltaTime); }
                },
                toolTip: "Hold the right grip to thrust where your right hand points."
            }),
            new ButtonInfo({
                buttonText: "TP Nearest Player [X]",
                enabled: false,
                method: () => {
                    if (!edge("tpn", leftPrimary)) return;
                    const me = playerPos(); let best: any = null, bd = 1e9;
                    for (const p of otherPlayers()) { const q = playerHeadPos(p); const d = Math.hypot(q[0] - me[0], q[1] - me[1], q[2] - me[2]); if (d < bd) { bd = d; best = q; } }
                    if (best) { getTransform(GTPlayerReal).method("set_position").invoke([best[0] + 0.6, best[1], best[2]]); setV(0, 0, 0); hudTag("TP", "#7fd4ff", "Teleported (" + bd.toFixed(1) + " m)"); }
                    else hudTag("TP", "#ffb86b", "No other players found");
                },
                toolTip: "Tap X to teleport next to the nearest player."
            }),
            new ButtonInfo({
                buttonText: "Save Pos 1",
                method: () => {
                    pcFlag.pos1 = playerPos(); hudTag("POS", "#6fdc8c", "Saved slot <b>1</b>");
                },
                isTogglable: false,
                toolTip: "Saves your position in slot 1."
            }),
            new ButtonInfo({
                buttonText: "Load Pos 1",
                method: () => {
                    const p = pcFlag.pos1; if (!p) { hudTag("POS", "#ffb86b", "Slot 1 is empty"); return; }
                    getTransform(GTPlayerReal).method("set_position").invoke(p); setV(0, 0, 0); hudTag("POS", "#7fd4ff", "Loaded slot <b>1</b>");
                },
                isTogglable: false,
                toolTip: "Teleports you to saved slot 1."
            }),
            new ButtonInfo({
                buttonText: "Save Pos 2",
                method: () => {
                    pcFlag.pos2 = playerPos(); hudTag("POS", "#6fdc8c", "Saved slot <b>2</b>");
                },
                isTogglable: false,
                toolTip: "Saves your position in slot 2."
            }),
            new ButtonInfo({
                buttonText: "Load Pos 2",
                method: () => {
                    const p = pcFlag.pos2; if (!p) { hudTag("POS", "#ffb86b", "Slot 2 is empty"); return; }
                    getTransform(GTPlayerReal).method("set_position").invoke(p); setV(0, 0, 0); hudTag("POS", "#7fd4ff", "Loaded slot <b>2</b>");
                },
                isTogglable: false,
                toolTip: "Teleports you to saved slot 2."
            }),
            new ButtonInfo({
                buttonText: "Save Pos 3",
                method: () => {
                    pcFlag.pos3 = playerPos(); hudTag("POS", "#6fdc8c", "Saved slot <b>3</b>");
                },
                isTogglable: false,
                toolTip: "Saves your position in slot 3."
            }),
            new ButtonInfo({
                buttonText: "Load Pos 3",
                method: () => {
                    const p = pcFlag.pos3; if (!p) { hudTag("POS", "#ffb86b", "Slot 3 is empty"); return; }
                    getTransform(GTPlayerReal).method("set_position").invoke(p); setV(0, 0, 0); hudTag("POS", "#7fd4ff", "Loaded slot <b>3</b>");
                },
                isTogglable: false,
                toolTip: "Teleports you to saved slot 3."
            }),
    ]);

    addTo("Become EyeCantSee", "fun", [
            new ButtonInfo({
                buttonText: "Spin Body",
                enabled: false,
                method: () => {
                    GTPlayerReal.method("Turn").invoke(180.0 * deltaTime);
                },
                toolTip: "Spins you around."
            }),
            new ButtonInfo({
                buttonText: "Spin Fast",
                enabled: false,
                method: () => {
                    GTPlayerReal.method("Turn").invoke(540.0 * deltaTime);
                },
                toolTip: "Spins you around quickly."
            }),
            new ButtonInfo({
                buttonText: "Bullet Time (L trigger)",
                enabled: false,
                method: () => {
                    Time.method("set_timeScale").invoke(leftTrigger ? 0.3 : 1.0);
                },
                disableMethod: () => {
                    Time.method("set_timeScale").invoke(1.0);
                },
                toolTip: "Slows time while the left trigger is held."
            }),
            new ButtonInfo({
                buttonText: "Size Stick (R stick)",
                enabled: false,
                method: () => {
                    const s = stick(true); let z = pcFlag.size ?? 1;
                    if (Math.abs(s[1]) > 0.2) z = Math.max(0.1, Math.min(8, z + s[1] * deltaTime * 1.2));
                    pcFlag.size = z; getTransform(GTPlayerReal).method("set_localScale").invoke([z, z, z]);
                },
                enableMethod: () => {
                    pcFlag.size = 1;
                },
                disableMethod: () => {
                    getTransform(GTPlayerReal).method("set_localScale").invoke([1, 1, 1]);
                },
                toolTip: "Push the right stick up/down to grow or shrink."
            }),
            new ButtonInfo({
                buttonText: "Size: Tiny",
                method: () => {
                    pcFlag.size = 0.3; getTransform(GTPlayerReal).method("set_localScale").invoke([0.3, 0.3, 0.3]);
                },
                isTogglable: false,
                toolTip: "Sets your size to 0.3x."
            }),
            new ButtonInfo({
                buttonText: "Size: Big",
                method: () => {
                    pcFlag.size = 2.5; getTransform(GTPlayerReal).method("set_localScale").invoke([2.5, 2.5, 2.5]);
                },
                isTogglable: false,
                toolTip: "Sets your size to 2.5x."
            }),
            new ButtonInfo({
                buttonText: "Size: Normal",
                method: () => {
                    pcFlag.size = 1; getTransform(GTPlayerReal).method("set_localScale").invoke([1, 1, 1]);
                },
                isTogglable: false,
                toolTip: "Sets your size to 1x."
            }),
            new ButtonInfo({
                buttonText: "Slow-Mo World",
                enabled: false,
                enableMethod: () => {
                    Time.method("set_timeScale").invoke(0.5);
                },
                disableMethod: () => {
                    Time.method("set_timeScale").invoke(1.0);
                },
                toolTip: "Time scale 0.5."
            }),
            new ButtonInfo({
                buttonText: "Fast World",
                enabled: false,
                enableMethod: () => {
                    Time.method("set_timeScale").invoke(1.7);
                },
                disableMethod: () => {
                    Time.method("set_timeScale").invoke(1.0);
                },
                toolTip: "Time scale 1.7."
            }),
            new ButtonInfo({
                buttonText: "Shaky Hands",
                enabled: false,
                method: () => {
                    const v = velNow(); setV(v[0] + (Math.random() - 0.5) * 0.4, v[1], v[2] + (Math.random() - 0.5) * 0.4);
                },
                toolTip: "Your velocity jitters a little. Silly."
            }),
            new ButtonInfo({
                buttonText: "Big Hands",
                enabled: false,
                method: () => {
                    leftHandTransform.method("set_localScale").invoke([3, 3, 3]); rightHandTransform.method("set_localScale").invoke([3, 3, 3]);
                },
                disableMethod: () => {
                    leftHandTransform.method("set_localScale").invoke([1, 1, 1]); rightHandTransform.method("set_localScale").invoke([1, 1, 1]);
                },
                toolTip: "Makes your hands 3x bigger."
            }),
            new ButtonInfo({
                buttonText: "Tiny Hands",
                enabled: false,
                method: () => {
                    leftHandTransform.method("set_localScale").invoke([0.4, 0.4, 0.4]); rightHandTransform.method("set_localScale").invoke([0.4, 0.4, 0.4]);
                },
                disableMethod: () => {
                    leftHandTransform.method("set_localScale").invoke([1, 1, 1]); rightHandTransform.method("set_localScale").invoke([1, 1, 1]);
                },
                toolTip: "Makes your hands tiny."
            }),
    ]);

    addTo("Cosmetic Tracers", "visual", [
            new ButtonInfo({
                buttonText: "PC Tracers",
                enabled: false,
                method: () => {
                    const ps = otherPlayers(), from = rightHandTransform.method("get_position").invoke();
                    ps.forEach((p, i) => {
                        const lr = getLine(i), c = hsv((i * 0.17) % 1);
                        lr.method("set_startColor").invoke([c[0], c[1], c[2], 1]); lr.method("set_endColor").invoke([c[0], c[1], c[2], 1]);
                        lr.method("SetPosition").invoke(0, from); lr.method("SetPosition").invoke(1, playerHeadPos(p));
                    });
                    hidePool(pcLines, ps.length, true);
                },
                disableMethod: () => {
                    destroyPool(pcLines, true);
                },
                toolTip: "Lines from your right hand to everyone else."
            }),
            new ButtonInfo({
                buttonText: "PC ESP Boxes",
                enabled: false,
                method: () => {
                    if (frameCount % 2) return;
                    const ps = otherPlayers();
                    ps.forEach((p, i) => {
                        const b = getBox(i), c = hsv((i * 0.17) % 1);
                        b.m.method("set_color").invoke([c[0], c[1], c[2], 0.28]);
                        const h = playerHeadPos(p); getTransform(b.o).method("set_position").invoke([h[0], h[1] - 0.25, h[2]]);
                    });
                    hidePool(pcBoxes, ps.length, false);
                },
                disableMethod: () => {
                    destroyPool(pcBoxes, false);
                },
                toolTip: "See-through boxes on every player."
            }),
            new ButtonInfo({
                buttonText: "PC Name ESP",
                enabled: false,
                method: () => {
                    const ps = otherPlayers(), me = vec(getHeadT().method("get_position").invoke());
                    ps.forEach((p, i) => {
                        const g = getTag(i), h = playerHeadPos(p), pos = [h[0], h[1] + 0.35, h[2]];
                        g.t.method("set_text").invoke(Il2Cpp.string(playerName(p)));
                        const tt = getTransform(g.o); tt.method("set_position").invoke(pos);
                        tt.method("set_rotation").invoke(Quaternion.method("LookRotation", 1).invoke([pos[0] - me[0], pos[1] - me[1], pos[2] - me[2]]));
                    });
                    hidePool(pcTags, ps.length, false);
                },
                disableMethod: () => {
                    destroyPool(pcTags, false);
                },
                toolTip: "Floating name tags above every player."
            }),
            new ButtonInfo({
                buttonText: "Fullbright",
                enabled: false,
                enableMethod: () => {
                    envApply([1, 1, 1], 0, [0, 0, 0], 1.0, false, [0, 0, 0]);
                },
                disableMethod: () => {
                    envRestore();
                },
                toolTip: "Maxes out ambient light and removes fog."
            }),
            new ButtonInfo({
                buttonText: "Rainbow Colour",
                enabled: false,
                method: () => {
                    if (time < (pcFlag.rbT || 0)) return; pcFlag.rbT = time + 0.2; pcFlag.rbH = ((pcFlag.rbH || 0) + 0.02) % 1;
                    const c = hsv(pcFlag.rbH); VRManagerClass.method("SetColour", 1).invoke([c[0], c[1], c[2], 1]);
                },
                toolTip: "Cycles your player colour (visible to others)."
            }),
            new ButtonInfo({
                buttonText: "Rainbow Name Tag",
                enabled: false,
                method: () => {
                    const lp = getLocalPlayer(); if (!lp) return; const nt = lp.field("NameText").value; if (!nt || nt.isNull()) return;
                    const c = hsv((time * 0.25) % 1); nt.method("set_color").invoke([c[0], c[1], c[2], 1]);
                },
                toolTip: "Cycles the colour of your own name tag (local only)."
            }),
            new ButtonInfo({
                buttonText: "HUD Always Visible",
                enabled: false,
                enableMethod: () => {
                    hudAlways = true;
                },
                disableMethod: () => {
                    hudAlways = false;
                },
                toolTip: "Keeps the room/ping status line on the HUD all the time."
            }),
            new ButtonInfo({
                buttonText: "HUD Show FPS",
                enabled: false,
                enableMethod: () => {
                    hudShowFps = true;
                },
                disableMethod: () => {
                    hudShowFps = false;
                },
                toolTip: "Adds FPS to the HUD status line."
            }),
    ]);

    addTo("Hand Noclip", "advantage", [
            new ButtonInfo({
                buttonText: "Nerf: No Cooldown",
                enabled: false,
                method: () => {
                    for (const g of myGuns()) { g.field("CooldownTime").value = 0.0; g.field("CanShoot").value = true; }
                },
                toolTip: "Removes the cooldown on your nerf gun."
            }),
            new ButtonInfo({
                buttonText: "Nerf: Strong Shots",
                enabled: false,
                method: () => {
                    for (const g of myGuns()) { const k = String(g.handle); if (!(k in nerfOrig)) nerfOrig[k] = g.field("ShootForce").value; g.field("ShootForce").value = nerfOrig[k] * 5; }
                },
                disableMethod: () => {
                    for (const g of myGuns()) { const k = String(g.handle); if (k in nerfOrig) g.field("ShootForce").value = nerfOrig[k]; }
                },
                toolTip: "5x projectile force on your nerf gun."
            }),
            new ButtonInfo({
                buttonText: "Nerf: Rapid Fire (R trigger)",
                enabled: false,
                method: () => {
                    if (rightTrigger && time > (pcFlag.nerfT || 0)) { pcFlag.nerfT = time + 0.12; for (const g of myGuns()) { try { g.field("CanShoot").value = true; g.method("ShootGun").invoke(); } catch { } } }
                },
                toolTip: "Hold the right trigger to spray shots."
            }),
            new ButtonInfo({
                buttonText: "Nerf: Auto-Shoot (right trigger)",
                enabled: false,
                method: () => {
                    if (rightTrigger && time > (pcFlag.nerfT || 0)) { pcFlag.nerfT = time + 0.12; for (const g of myGuns()) { try { g.field("CanShoot").value = true; g.method("StartShoot").invoke(); } catch { } } }
                },
                toolTip: "Hold the right trigger to spray shots."
            }),
            new ButtonInfo({
                buttonText: "Nerf: Always Enabled",
                enabled: false,
                method: () => {
                    for (const g of myGuns()) g.field("ShootingEnabled").value = true;
                },
                toolTip: "Forces ShootingEnabled on."
            }),
            new ButtonInfo({
                buttonText: "Nerf: Always Able To Shoot",
                enabled: false,
                method: () => {
                    for (const g of myGuns()) g.field("CanShoot").value = true;
                },
                toolTip: "Forces ShootingEnabled on."
            }),
    ]);

    addTo("Join Random", "misc", [
new ButtonInfo({
                buttonText: "Destroy All",
                method: () => { 
try {
                    PhotonNetwork.method("DestroyAll").invoke();
} catch(_) { console.log(_); }
                },
                isTogglable: false,
                toolTip: "Destroy."
            }),
            new ButtonInfo({
                buttonText: "Crash All",
                method: () => { 
try {
                    const playerListOthers = PhotonNetwork.method("get_PlayerListOthers", 0).invoke();
                    for (let i = 0; i < playerListOthers.method("get_Count").invoke(); i++) {
                        PhotonNetwork.method("DestroyPlayerObjects", 1).invoke(playerListOthers[i]);
                    }
} catch(_) { console.log(_); }
                },
                isTogglable: false,
                toolTip: "crsaher."
            }),
            new ButtonInfo({
                buttonText: "Crash All 2",
                method: () => { 
try {
                    const playerList = PhotonNetwork.method("get_PlayerList", 0).invoke();
                    PhotonNetwork.method("DestroyPlayerObjects", 1).invoke(playerList);
} catch(_) { console.log(_); }
                },
                isTogglable: false,
                toolTip: "crsaher."
            }),
            new ButtonInfo({
                buttonText: "Set Name: https://discord.gg/PABAEuWKP7",
                method: () => {
                    setPlayerName("https://discord.gg/PABAEuWKP7");
                },
                isTogglable: false,
                toolTip: "Changes your display name to https://discord.gg/PABAEuWKP7."
            }),
            new ButtonInfo({
                buttonText: "Set Name: discord.gg/PABAEuWKP7",
                method: () => {
                    setPlayerName("discord.gg/PABAEuWKP7");
                },
                isTogglable: false,
                toolTip: "Changes your display name to discord.gg/PABAEuWKP7."
            }),
            new ButtonInfo({
                buttonText: "Set Name: EyeCantSee",
                method: () => {
                    setPlayerName("EyeCantSee");
                },
                isTogglable: false,
                toolTip: "Changes your display name to EyeCantSee."
            }),
            new ButtonInfo({
                buttonText: "Set Name: dawg",
                method: () => {
                    setPlayerName("dawg");
                },
                isTogglable: false,
                toolTip: "Changes your display name to dawg."
            }),
            new ButtonInfo({
                buttonText: "Join Room: dawg",
                method: () => {
                    VRManagerClass.method("JoinPrivateRoom", 1).invoke(Il2Cpp.string("dawg"));
                },
                isTogglable: false,
                toolTip: "Joins the private room named dawg."
            }),
            new ButtonInfo({
                buttonText: "Leave Room",
                method: () => {
                    PhotonNetwork.method("LeaveRoom", 1).invoke(true);
                },
                isTogglable: false,
                toolTip: "Leaves the current room."
            }),
            new ButtonInfo({
                buttonText: "Disconnect (Photon)",
                method: () => {
                    getManager().method("Disconnect").invoke();
                },
                isTogglable: false,
                toolTip: "Disconnects from Photon."
            }),
            new ButtonInfo({
                buttonText: "Reconnect",
                method: () => {
                    VRManagerClass.method("Connect").invoke();
                },
                isTogglable: false,
                toolTip: "Reconnects to Photon."
            }),
            new ButtonInfo({
                buttonText: "Join Random Code",
                method: () => {
                    let c = ""; for (let i = 0; i < 5; i++) c += "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random() * 24)];
                    VRManagerClass.method("JoinPrivateRoom", 1).invoke(Il2Cpp.string(c)); hudTag("ROOM", "#7fd4ff", "Joining <b>" + c + "</b>...");
                },
                isTogglable: false,
                toolTip: "Joins a random 5-letter private room."
            }),
            new ButtonInfo({
                buttonText: "Rejoin Last Room",
                method: () => {
                    if (!lastRoomCode) { hudTag("ROOM", "#ffb86b", "No previous room"); return; }
                    VRManagerClass.method("JoinPrivateRoom", 1).invoke(Il2Cpp.string(lastRoomCode)); hudTag("ROOM", "#7fd4ff", "Rejoining <b>" + lastRoomCode + "</b>...");
                },
                isTogglable: false,
                toolTip: "Rejoins the last room code you were in."
            }),
            new ButtonInfo({
                buttonText: "Show Room Code",
                method: () => {
                    hudTag("ROOM", "#7fd4ff", prevRoom ? "Room code: <b>" + prevRoom + "</b>" : "Not in a room", 8);
                },
                isTogglable: false,
                toolTip: "Shows the current room code on the HUD."
            }),
            new ButtonInfo({
                buttonText: "Auto Reconnect",
                enabled: false,
                method: () => {
                    if (time < (pcFlag.arT || 0)) return; pcFlag.arT = time + 6;
                    if (!PhotonNetwork.method("get_IsConnected").invoke()) { VRManagerClass.method("Connect").invoke(); hudTag("NET", "#ffb86b", "Reconnecting..."); }
                    else if (!PhotonNetwork.method("get_InRoom").invoke() && lastRoomCode) { VRManagerClass.method("JoinPrivateRoom", 1).invoke(Il2Cpp.string(lastRoomCode)); }
                },
                toolTip: "Reconnects to Photon (and your last room) if you get dropped."
            }),
            new ButtonInfo({
                buttonText: "Clear Saved Mods",
                method: () => {
                    PlayerPrefs.method("SetString").invoke(Il2Cpp.string("pc_enabled"), Il2Cpp.string("")); PlayerPrefs.method("Save").invoke(); hudTag("INFO", "#7fd4ff", "Saved mod list cleared");
                },
                isTogglable: false,
                toolTip: "Forgets which mods were enabled last session."
            }),
            new ButtonInfo({
                buttonText: "Name: goober",
                method: () => {
                    setPlayerName("goober");
                },
                isTogglable: false,
                toolTip: "Sets your display name to goober."
            }),
            new ButtonInfo({
                buttonText: "Name: gigachad",
                method: () => {
                    setPlayerName("gigachad");
                },
                isTogglable: false,
                toolTip: "Sets your display name to gigachad."
            }),
            new ButtonInfo({
                buttonText: "Name: noobmaster",
                method: () => {
                    setPlayerName("noobmaster");
                },
                isTogglable: false,
                toolTip: "Sets your display name to noobmaster."
            }),
            new ButtonInfo({
                buttonText: "Name: tuffguy",
                method: () => {
                    setPlayerName("tuffguy");
                },
                isTogglable: false,
                toolTip: "Sets your display name to tuffguy."
            }),
            new ButtonInfo({
                buttonText: "Name: sigma",
                method: () => {
                    setPlayerName("sigma");
                },
                isTogglable: false,
                toolTip: "Sets your display name to sigma."
            }),
            new ButtonInfo({
                buttonText: "Name: Random",
                method: () => {
                    setPlayerName("Player" + Math.floor(1000 + Math.random() * 9000));
                },
                isTogglable: false,
                toolTip: "Random player name."
            }),
            new ButtonInfo({
                buttonText: "Color: Red",
                method: () => {
                    setPlayerColor([1, 0.1, 0.1]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to Red."
            }),
            new ButtonInfo({
                buttonText: "Color: Orange",
                method: () => {
                    setPlayerColor([1, 0.55, 0.05]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to Orange."
            }),
            new ButtonInfo({
                buttonText: "Color: Yellow",
                method: () => {
                    setPlayerColor([1, 0.95, 0.1]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to Yellow."
            }),
            new ButtonInfo({
                buttonText: "Color: Green",
                method: () => {
                    setPlayerColor([0.1, 0.9, 0.2]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to Green."
            }),
            new ButtonInfo({
                buttonText: "Color: Cyan",
                method: () => {
                    setPlayerColor([0.1, 0.9, 0.95]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to Cyan."
            }),
            new ButtonInfo({
                buttonText: "Color: Blue",
                method: () => {
                    setPlayerColor([0.15, 0.3, 1]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to Blue."
            }),
            new ButtonInfo({
                buttonText: "Color: Purple",
                method: () => {
                    setPlayerColor([0.6, 0.2, 0.95]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to Purple."
            }),
            new ButtonInfo({
                buttonText: "Color: Pink",
                method: () => {
                    setPlayerColor([1, 0.4, 0.75]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to Pink."
            }),
            new ButtonInfo({
                buttonText: "Color: White",
                method: () => {
                    setPlayerColor([1, 1, 1]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to White."
            }),
            new ButtonInfo({
                buttonText: "Color: Black",
                method: () => {
                    setPlayerColor([0.02, 0.02, 0.02]);
                },
                isTogglable: false,
                toolTip: "Sets your player colour to Black."
            }),
            new ButtonInfo({
                buttonText: "Prefab: Reload List",
                method: () => {
                    prefabLoad();
                },
                isTogglable: false,
                toolTip: "Lists every prefab in the game's Resources folder."
            }),
            new ButtonInfo({
                buttonText: "Prefab: Next",
                method: () => {
                    prefabStep(1);
                },
                isTogglable: false,
                toolTip: "Selects the next prefab."
            }),
            new ButtonInfo({
                buttonText: "Prefab: Previous",
                method: () => {
                    prefabStep(-1);
                },
                isTogglable: false,
                toolTip: "Selects the previous prefab."
            }),
            new ButtonInfo({
                buttonText: "Prefab: Spawn (Local)",
                method: () => {
                    if (!prefabs.length) prefabLoad(); if (prefabs.length) spawnLocalIdx(prefabIdx);
                },
                isTogglable: false,
                toolTip: "Spawns the selected prefab in front of you, only you see it."
            }),
            new ButtonInfo({
                buttonText: "Prefab: Spawn (Network)",
                method: () => {
                    if (!prefabs.length) prefabLoad(); if (prefabs.length) spawnNet(prefabNames[prefabIdx]);
                },
                isTogglable: false,
                toolTip: "Spawns the selected prefab through PhotonNetwork.Instantiate (needs a Photon prefab in Resources)."
            }),
            new ButtonInfo({
                buttonText: "Spawn Boy (Local)",
                method: () => {
                    const i = prefabFind("boy"); if (i < 0) hudTag("SPAWN", "#ffb86b", "No prefab named Boy found"); else spawnLocalIdx(i);
                },
                isTogglable: false,
                toolTip: "Spawns the 'Boy' prefab locally if the game has one."
            }),
            new ButtonInfo({
                buttonText: "Spawn Boy (Network)",
                method: () => {
                    const i = prefabFind("boy"); if (i < 0) hudTag("SPAWN", "#ffb86b", "No prefab named Boy found"); else spawnNet(prefabNames[i]);
                },
                isTogglable: false,
                toolTip: "Spawns the 'Boy' prefab through Photon if the game has one."
            }),
            new ButtonInfo({
                buttonText: "Prefab: Delete Mine",
                method: () => {
                    spawnDelete();
                },
                isTogglable: false,
                toolTip: "Removes everything you spawned."
            }),
    ]);

    csIndex = buttons.length;
    buttons.push([
            new ButtonInfo({
                buttonText: "Exit CS Mods",
                method: () => {
                    currentCategory = 0; currentPage = 0;
                },
                isTogglable: false,
                toolTip: "Returns you back to the main category."
            }),
            new ButtonInfo({
                buttonText: "CS Day",
                method: () => {
                    envApply([0.8, 0.8, 0.8], 0, [0, 0, 0], 1.0, false, [0, 0, 0]); hudTag("CS", "#c792ff", "Day");
                },
                isTogglable: false,
                toolTip: "Bright daytime look (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Night",
                method: () => {
                    envApply([0.06, 0.07, 0.13], 0.012, [0.02, 0.03, 0.07], 0.12, true, [0.01, 0.01, 0.04]); hudTag("CS", "#c792ff", "Night");
                },
                isTogglable: false,
                toolTip: "Dark night look (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Sunset",
                method: () => {
                    envApply([0.55, 0.32, 0.22], 0.006, [0.9, 0.45, 0.25], 0.8, true, [0.95, 0.5, 0.3]); hudTag("CS", "#c792ff", "Sunset");
                },
                isTogglable: false,
                toolTip: "Orange sunset look (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Overcast",
                method: () => {
                    envApply([0.45, 0.47, 0.5], 0.01, [0.5, 0.52, 0.55], 0.55, true, [0.5, 0.52, 0.55]); hudTag("CS", "#c792ff", "Overcast");
                },
                isTogglable: false,
                toolTip: "Grey cloudy look (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Fog",
                method: () => {
                    envApply([0.7, 0.7, 0.72], 0.04, [0.75, 0.75, 0.78], 0.8, true, [0.75, 0.75, 0.78]); hudTag("CS", "#c792ff", "Fog");
                },
                isTogglable: false,
                toolTip: "Thick white fog (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Clear Sky",
                method: () => {
                    wxStorm = false; wxStop(); starsStop(); envRestore(); hudTag("CS", "#c792ff", "Sky restored");
                },
                isTogglable: false,
                toolTip: "Restores the original sky and lighting, and stops weather."
            }),
            new ButtonInfo({
                buttonText: "CS Rain",
                enabled: false,
                enableMethod: () => {
                    wxStorm = false; wxStart("rain");
                },
                disableMethod: () => {
                    wxStop();
                },
                toolTip: "Rain falling around you (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Snow",
                enabled: false,
                enableMethod: () => {
                    wxStorm = false; wxStart("snow");
                },
                disableMethod: () => {
                    wxStop();
                },
                toolTip: "Snow falling around you (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Storm",
                enabled: false,
                enableMethod: () => {
                    envApply([0.06, 0.07, 0.13], 0.012, [0.02, 0.03, 0.07], 0.12, true, [0.01, 0.01, 0.04]); wxStart("rain"); wxStorm = true; wxNextFlash = time + 2;
                },
                disableMethod: () => {
                    wxStorm = false; wxStop(); envRestore();
                },
                toolTip: "Night + rain + lightning flashes (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Stars",
                enabled: false,
                enableMethod: () => {
                    starsStart();
                },
                disableMethod: () => {
                    starsStop();
                },
                toolTip: "A field of stars in the sky (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Stick",
                enabled: false,
                enableMethod: () => {
                    csStick();
                },
                disableMethod: () => {
                    csKill("stick");
                },
                toolTip: "A stick in your right hand like the Gorilla Tag one (client-side, length/style in Settings)."
            }),
            new ButtonInfo({
                buttonText: "CS Hand Orbs",
                enabled: false,
                enableMethod: () => {
                    csOrbs();
                },
                disableMethod: () => {
                    csKill("orbs"); csKill("orbsR");
                },
                toolTip: "Colour-cycling orbs on both hands (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Halo",
                enabled: false,
                enableMethod: () => {
                    csHalo();
                },
                disableMethod: () => {
                    csKill("halo");
                },
                toolTip: "A spinning gold halo over your head (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Wings",
                enabled: false,
                enableMethod: () => {
                    csWings();
                },
                disableMethod: () => {
                    csKill("wings");
                },
                toolTip: "Flapping wings on your back (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Tail",
                enabled: false,
                enableMethod: () => {
                    csTail();
                },
                disableMethod: () => {
                    csKill("tail");
                },
                toolTip: "A wagging tail (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Top Hat",
                enabled: false,
                enableMethod: () => {
                    csHat();
                },
                disableMethod: () => {
                    csKill("hat");
                },
                toolTip: "A top hat (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Antenna",
                enabled: false,
                enableMethod: () => {
                    csAntenna();
                },
                disableMethod: () => {
                    csKill("antenna");
                },
                toolTip: "A blinking antenna (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Cosmetic: Head",
                method: () => {
                    cosCycle(0);
                },
                isTogglable: false,
                toolTip: "Cycles the head cosmetics the game ships with, only you see them."
            }),
            new ButtonInfo({
                buttonText: "CS Cosmetic: Face",
                method: () => {
                    cosCycle(1);
                },
                isTogglable: false,
                toolTip: "Cycles the face cosmetics the game ships with, only you see them."
            }),
            new ButtonInfo({
                buttonText: "CS Cosmetic: Body",
                method: () => {
                    cosCycle(2);
                },
                isTogglable: false,
                toolTip: "Cycles the body cosmetics the game ships with, only you see them."
            }),
            new ButtonInfo({
                buttonText: "CS Cosmetic: Left Hand",
                method: () => {
                    cosCycle(3);
                },
                isTogglable: false,
                toolTip: "Cycles the left hand cosmetics the game ships with, only you see them."
            }),
            new ButtonInfo({
                buttonText: "CS Cosmetic: Right Hand",
                method: () => {
                    cosCycle(4);
                },
                isTogglable: false,
                toolTip: "Cycles the right hand cosmetics the game ships with, only you see them."
            }),
            new ButtonInfo({
                buttonText: "CS Cosmetics: Show All",
                method: () => {
                    cosAll(true);
                },
                isTogglable: false,
                toolTip: "Enables every cosmetic asset on your rig (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Cosmetics: Hide All",
                method: () => {
                    cosAll(false);
                },
                isTogglable: false,
                toolTip: "Hides every cosmetic on your rig (client-side)."
            }),
            new ButtonInfo({
                buttonText: "CS Show Own Rig",
                enabled: false,
                method: () => {
                    const lp = getLocalPlayer(); if (lp) lp.field("HideLocalPlayer").value = false;
                },
                disableMethod: () => {
                    const lp = getLocalPlayer(); if (lp) lp.field("HideLocalPlayer").value = true;
                },
                toolTip: "Stops the game hiding your own avatar so you can see cosmetics on yourself."
            }),
    ]);
    {
        const mi = buttons[0].findIndex(b => b.buttonText === "Safety Mods");
        buttons[0].splice(mi >= 0 ? mi + 1 : buttons[0].length, 0, new ButtonInfo({
            buttonText: "CS Mods",
            method: () => { currentCategory = csIndex; currentPage = 0 },
            isTogglable: false,
            toolTip: "Opens the client-side category (sky, weather, cosmetics, rig objects)."
        }));
    }

    // Mods that exist only to disrupt other players in a room stay in the list but do nothing in this port.
    for (const b of buttons.flat()) {
        if (/^(Lag Gun|Lag Gun 2|Lag Gun 3|Lag All|Crash All|Crash All 2|Destroy All|Set Master)\b/.test(b.buttonText) || b.buttonText.startsWith("Crash All") || b.buttonText.startsWith("Lag All")) {
            b.method = undefined; b.enableMethod = undefined; b.disableMethod = undefined;
            b.toolTip = "Not ported (disabled).";
        }
    }

    // every new button must be in the lookup map (menu buttons are found by name)
    buttons.flat().forEach(b => buttonMap.set(b.buttonText, b));

    // ---- shared pools / helpers used by the mods above ----
    const pcLines: any[] = [], pcBoxes: any[] = [], pcTags: any[] = [];
    const getLine = (i: number) => {
        if (!pcLines[i]) {
            const o = GameObject.new("pcLine" + i); const lr = addComponent(o, LineRenderer);
            lr.method("get_material").invoke().method("set_shader").invoke(TextShader);
            lr.method("set_startWidth").invoke(0.012); lr.method("set_endWidth").invoke(0.012);
            lr.method("set_positionCount").invoke(2); lr.method("set_useWorldSpace").invoke(true);
            pcLines[i] = lr;
        }
        pcLines[i].method("get_gameObject").invoke().method("SetActive").invoke(true);
        return pcLines[i];
    };
    const getBox = (i: number) => {
        if (!pcBoxes[i]) {
            const o = GameObject.method("CreatePrimitive").invoke(3); try { Destroy(getComponent(o, Collider)); } catch { }
            getTransform(o).method("set_localScale").invoke([0.45, 0.8, 0.45]);
            const m = getComponent(o, Renderer).method("get_material").invoke(); m.method("set_shader").invoke(TextShader);
            pcBoxes[i] = { o, m };
        }
        pcBoxes[i].o.method("SetActive").invoke(true);
        return pcBoxes[i];
    };
    const getTag = (i: number) => {
        if (!pcTags[i]) {
            const o = GameObject.new("pcTag" + i); const t = addComponent(o, TextMeshPro);
            t.method("set_fontSize").invoke(1.6); try { t.method("set_alignment").invoke(514); } catch { }
            getTransform(o).method("set_localScale").invoke([0.1, 0.1, 0.1]);
            pcTags[i] = { o, t };
        }
        pcTags[i].o.method("SetActive").invoke(true);
        return pcTags[i];
    };
    const hidePool = (pool: any[], from: number, isLine: boolean) => {
        for (let i = from; i < pool.length; i++) { if (!pool[i]) continue; (isLine ? pool[i].method("get_gameObject").invoke() : pool[i].o).method("SetActive").invoke(false); }
    };
    const destroyPool = (pool: any[], isLine: boolean) => {
        for (const x of pool) { if (!x) continue; try { Destroy(isLine ? x.method("get_gameObject").invoke() : x.o); } catch { } }
        pool.length = 0;
    };
    let nerfCache: any[] = [], nerfT = 0;
    const nerfOrig: any = {};
    const NerfClass = AssemblyCSharp.class("KeosNerfGun");
    const myGuns = (): any[] => {
        if (time > nerfT) {
            nerfT = time + 1.0; nerfCache = [];
            try {
                const arr = Object.method("FindObjectsOfType").inflate(NerfClass).invoke();
                for (let i = 0; i < arr.length; i++) { const g = arr.get(i); try { if (g.field("PTView").value.method("get_IsMine").invoke()) nerfCache.push(g); } catch { } }
            } catch { }
        }
        return nerfCache;
    };

    function getIndex(buttonText: string): ButtonInfo {
        return buttonMap.get(buttonText);
    }
    function getCategoryIndex(button: ButtonInfo): number {
        let ret = null;
        buttons.forEach((category, categoryIndex) => {
            category.forEach(categoryButton => {
                if (button == categoryButton) {
                    ret = categoryIndex;
                }
            });
        });
        return ret;
    }

    const ButtonActivation = GorillaReportButton.method("OnTriggerEnter");
    ButtonActivation.implementation = function (collider) {
        try { if (pcButtonHook.call(this, collider)) return; } catch (e: any) { pcLog("button", e); return; }
        return this.method("OnTriggerEnter").invoke(collider);
    };
    const pcButtonHook = function (this: any, collider: any): boolean {
        const rawName = this.method("get_name").invoke().toString();

        if (rawName.length > 1 && rawName[1] == "@") {
            if (referenceCollider && collider.handle.equals(referenceCollider.handle)) {
                const goName = rawName.substring(2, rawName.length - 1);
                const _time = Time.method("get_time").invoke();

                if (_time > buttonClickDelay) {
                    buttonClickDelay = _time + 0.2;

                    const button = getIndex(goName)
                    playButtonSound();
                    if (button) {
                        if (leftGrab) {
                            toggleFavorite(button);
                            reloadMenu();
                        } else {
                            if (button.isTogglable) {
                                button.enabled = !button.enabled;
                                try { hudTag(button.enabled ? "ENABLE" : "DISABLE", button.enabled ? "green" : "red", button.buttonText); } catch { }

                                reloadMenu();
                                if (button?.enabled) {
                                    if (button.toolTip && buttonNotifications)
                                        sendNotification("<color=grey>[</color><color=green>ENABLE</color><color=grey>]</color> " + button.toolTip, false);
                                    try { button.enableMethod?.(); } catch (e: any) { console.log("[port] '" + button.buttonText + "' unsupported here: " + e.message); button.enabled = false; reloadMenu(); }
                                } else {
                                    if (button.toolTip && buttonNotifications)
                                        sendNotification("<color=grey>[</color><color=red>DISABLE</color><color=grey>]</color> " + button.toolTip, false);
                                    try { button?.disableMethod?.(); } catch { }
                                }

                            } else {
                                reloadMenu();
                                if (button.toolTip && buttonNotifications)
                                    sendNotification("<color=grey>[</color><color=green>ENABLE</color><color=grey>]</color> " + button.toolTip, false);
                                try { const ci = getCategoryIndex(button); if (isModCat(ci) && !button.buttonText.startsWith("Exit")) hudTag("RUN", "#7fd4ff", button.buttonText); } catch { }
                                try { button?.method?.(); } catch (e: any) { console.log("[port] '" + button.buttonText + "' unsupported here: " + e.message); }
                            }
                            try { savePersist(); } catch { }
                            if (getCategoryIndex(button) == 12 && !enabledRecent)
                                loadEnabled();
                        }
                    }
                }
            }

            return true;
        }

        return false;
    };

    // (VRRig.OnDisable / MonkeAgent.SendReport hooks don't exist in this game - removed)

    // Gorilla Tag's LateUpdate -> this game's GorillaLocomotion.Player.Update
    const LateUpdate = PlayerClass.method("Update");

    LateUpdate.implementation = function () {
        try { pcLoop.call(this); } catch (e: any) { pcLog("loop", e); }
        return this.method("Update").invoke();
    };
    const pcLoop = function (this: any) {
        leftPrimary = ControllerInputPoller.field("leftControllerPrimaryButton").value;
        leftSecondary = ControllerInputPoller.field("leftControllerSecondaryButton").value;

        rightPrimary = ControllerInputPoller.field("rightControllerPrimaryButton").value;
        rightSecondary = ControllerInputPoller.field("rightControllerSecondaryButton").value;

        leftGrab = ControllerInputPoller.field("leftGrab").value;
        rightGrab = ControllerInputPoller.field("rightGrab").value;

        leftTrigger = ControllerInputPoller.field("leftControllerIndexFloat").value > 0.5;
        rightTrigger = ControllerInputPoller.field("rightControllerIndexFloat").value > 0.5;

        deltaTime = Time.method("get_deltaTime").invoke();
        time = Time.method("get_time").invoke();
        frameCount++;

        if ((righthand && rightSecondary) || (!righthand && leftSecondary)) {
            if (currentNotification != "" && time > notifactionResetTime)
                reloadMenu();

            if (menu == null) {
                renderMenu();
            } else {
                recenterMenu();
            }
        } else {
            if (menu != null) {
                Destroy(menu);
                menu = null;
            }
        }

        if (menu == null) {
            if (reference != null) {
                Destroy(reference);
                reference = null;
            }
        } else {
            if (reference == null) {
                renderReference();
            }
        }

        try {
            if (GunPointer != null) {
                if (!(GunPointer.method("get_activeSelf").invoke())) {
                    Destroy(GunPointer);
                    GunPointer = null;
                }
                else
                    GunPointer.method("SetActive").invoke(false);
            }

            let lineObj = GunLine.method("get_gameObject").invoke();
            if (lineObj != null) {
                if (!(lineObj.method("get_activeSelf").invoke())) {
                    Destroy(lineObj);
                    GunLine = null;
                }
                else
                    lineObj.method("SetActive").invoke(false);
            }
        } catch { }

        hudTick();

        buttons.flat()
            .filter(button => button.enabled)
            .forEach(button => {
                if (button.method) {
                    try {
                        button.method();
                    } catch (error: any) {
                        console.log("[port] '" + (button.buttonText || "unnamed") + "' unsupported in this game, disabled: " + error.message);
                        button.enabled = false;
                        try { reloadMenu(); } catch { }
                    }
                }
            });

    };

const currentModCount = buttons.flat().length;

console.log(`\n\t

    ███████╗██╗   ██╗███████╗ ██████╗ █████╗ ███╗   ██╗████████╗███████╗███████╗███████╗   
    ██╔════╝╚██╗ ██╔╝██╔════╝██╔════╝██╔══██╗████╗  ██║╚══██╔══╝██╔════╝██╔════╝██╔════╝  
    █████╗   ╚████╔╝ █████╗  ██║     ███████║██╔██╗ ██║   ██║   ███████╗█████╗  █████╗     
    ██╔══╝    ╚██╔╝  ██╔══╝  ██║     ██╔══██║██║╚██╗██║   ██║   ╚════██║██╔══╝  ██╔══╝     
    ███████╗   ██║   ███████╗╚██████╗██║  ██║██║ ╚████║   ██║   ███████║███████╗███████╗   
    ╚══════╝   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝╚══════╝   
                    Made By: EyeCantSee - Discord: @eyecantsee0466
                    Discord Server: https://discord.gg/PABAEuWKP7
                            Server: discord.gg/PABAEuWKP7

                          Eye's Tuff Menu | Version: ${version}

                            Current Mod Count: ${currentModCount} Mods

                         Compiled: ${new Date().toISOString()}
`);
};

// Wait until the player rig and Photon manager exist before installing anything.
// Hooking while the game is still starting up is what caused the "breakpoint triggered" on the first launch.
let pcWaitTries = 0;
const pcWaitReady = () => {
    let ready = false;
    try {
        const img = Il2Cpp.domain.assembly("Assembly-CSharp").image;
        const p = img.class("GorillaLocomotion.Player").method("get_Instance").invoke();
        const m = img.class("Photon.VR.PhotonVRManager").method("get_Manager").invoke();
        ready = !!p && !p.isNull() && !!m && !m.isNull();
    } catch (e) { ready = false; }
    if (ready) {
        console.log("[pc] game ready, loading menu...");
        setTimeout(() => Il2Cpp.perform(pcMain), 2000);
    } else {
        if (pcWaitTries++ % 10 === 0) console.log("[pc] waiting for the game to finish loading...");
        setTimeout(() => Il2Cpp.perform(pcWaitReady), 1000);
    }
};
Il2Cpp.perform(pcWaitReady);
