if (globalThis.importScripts) bs = pc.ScriptType;


var CameraController = class extends bs {
    initialize() {
        this.vec2A = new pc.Vec2();
        this.vec2B = new pc.Vec2();
        this.vec3A = new pc.Vec3();

        this.lastRotate = 0;
        this.lastRotateValue = 0;
        
    }
 
    postUpdate() {
        var position = this.entity.getPosition();
        st.Vr.level.entity.setPosition(position.x,st.Vr.level.entity.getPosition().y, position.z);
    }
    
    onTeleport(position) {
        if (this.app.xr.type === pc.XRTYPE_AR)
            return;

        this.vec3A.copy(this.camera.getLocalPosition()).scale(-1);
        this.entity.setLocalPosition(position);
        this.entity.translate(0, this.height, 0);
        this.entity.translateLocal(this.vec3A);
    }

    onMove(x, y, dt) {
        this.vec2A.set(x, y);

        if (this.vec2A.length()) {
            this.vec2A.normalize();

            this.vec2B.x = this.camera.forward.x;
            this.vec2B.y = this.camera.forward.z;
            this.vec2B.normalize();

            var rad = Math.atan2(this.vec2B.x, this.vec2B.y) - (Math.PI / 2);

            var t = this.vec2A.x * Math.sin(rad) - this.vec2A.y * Math.cos(rad);
            this.vec2A.y = this.vec2A.y * Math.sin(rad) + this.vec2A.x * Math.cos(rad);
            this.vec2A.x = t;

            this.vec2A.scale(this.movementSpeed);
            this.entity.translate(this.vec2A.x * dt, 0, this.vec2A.y * dt);
        }
    }

    onRotate(yaw, dt) {
        //if(Math.abs(yaw)< this.rotateThreshold) yaw=0;
        //if ((now - this.lastRotate) < 200)return;

        if (this.lastRotateValue !== 0) {
            if (this.lastRotateValue > 0) {
                if (yaw < this.rotateResetThreshold) {
                    this.lastRotateValue = 0;
                } else {
                    return;
                }
            } else {
                if (yaw > -this.rotateResetThreshold) {
                    this.lastRotateValue = 0;
                } else {
                    return;
                }
            }
        }

        if (Math.abs(yaw) > this.rotateThreshold) {
            this.lastRotateValue = Math.sign(yaw);

            this.vec3A.copy(this.camera.getLocalPosition());
            this.entity.translateLocal(this.vec3A);
            this.entity.rotateLocal(0, Math.sign(yaw) * -this.rotateSpeed, 0);
            this.entity.translateLocal(this.vec3A.scale(-1));
        }
    }
    swap(old) {
        this.DoSwap(old);
    };
    InitArguments() {
        this.height = 1.6;
        this.movementSpeed = 1.5;
        this.rotateSpeed = 45;
        this.rotateThreshold = 0.5;
        this.rotateResetThreshold = 0.25;
        this.camera = pc.Entity.prototype;
    }
}

pc.registerScript(CameraController, 'camera-controller');
CameraController.attributes.add('height', { type: 'number', default: 1.6, placeholder: 'm', title: 'Height from Floor' });
CameraController.attributes.add('movementSpeed', { type: 'number', default: 1.5, placeholder: 'm/s', title: 'Movement Speed' });
CameraController.attributes.add('rotateSpeed', { type: 'number', default: 45, placeholder: '°', title: 'Rotation Speed' });
CameraController.attributes.add('rotateThreshold', { type: 'number', default: 0.5, min: 0, max: 1, title: 'Rotation thumbstick threshold' });
CameraController.attributes.add('rotateResetThreshold', { type: 'number', default: 0.25, min: 0, max: 1, title: 'Rotation thumbstick reset threshold' });
CameraController.attributes.add('camera', { type: 'entity', title: 'Camera Entity' });