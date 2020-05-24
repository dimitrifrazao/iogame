enum DirEnum {
    None=0,
    Up=1,
    Down=2,
    Left=3,
    Right=4,
    UpLeft=5,
    UpRight=6,
    DownLeft=7,
    DownRight=8
}

enum KeyCode{
    W=87,
    A=65,
    S=83,
    D=68,
    Left=37,
    Right=39,
    Up=38,
    Down=40,
    Space=32
}
class InputManager{

    static w:boolean = false;
    static a:boolean = false;
    static s:boolean = false;
    static d:boolean = false;

    static space:boolean = false;

    static socket:any;

    static SetSocket(socket:any){
        InputManager.socket = socket;
    }

    static EmitPlayerDir(){

        let playerDir:DirEnum = DirEnum.None;
        if( InputManager.w != InputManager.s){
            if( InputManager.w){
                if( InputManager.a){
                    playerDir = DirEnum.UpLeft;
                }
                else if( InputManager.d){
                    playerDir = DirEnum.UpRight;
                }
                else{
                    playerDir = DirEnum.Up;
                }
            }
            else{
                if( InputManager.a){
                    playerDir = DirEnum.DownLeft;
                }
                else if( InputManager.d){
                    playerDir = DirEnum.DownRight;
                }
                else{
                    playerDir = DirEnum.Down;
                }
            }
        }
        else if( InputManager.a != InputManager.d){
            if( InputManager.a){
                playerDir = DirEnum.Left;
            }
            else if( InputManager.d){
                playerDir = DirEnum.Right;
            }
        }
 
        InputManager.socket.emit('playerDir', {dir:playerDir});
    }

    static OnKeyDown(keyCode:number){

        switch(keyCode){
            case KeyCode.W:
                InputManager.w = true;
                InputManager.EmitPlayerDir();
                break;
            case KeyCode.A:
                InputManager.a = true;
                InputManager.EmitPlayerDir();
                break;
            case KeyCode.S:
                InputManager.s = true;
                InputManager.EmitPlayerDir();
                break;
            case KeyCode.D:
                InputManager.d = true;
                InputManager.EmitPlayerDir();
                break;

            case KeyCode.Up:
                InputManager.socket.emit('shoot', {dir:DirEnum.Up});
                break;
            case KeyCode.Down:
                InputManager.socket.emit('shoot', {dir:DirEnum.Down});
                break;
            case KeyCode.Left:
                InputManager.socket.emit('shoot', {dir:DirEnum.Left});
                break;
            case KeyCode.Right:
                InputManager.socket.emit('shoot', {dir:DirEnum.Right});
                break;

       
        }
    }

    static OnKeyUp(keyCode:number){
        
        switch(keyCode){
            case KeyCode.W:
                InputManager.w = false;
                InputManager.EmitPlayerDir();
                break;
            case KeyCode.A:
                InputManager.a = false;
                InputManager.EmitPlayerDir();
                break;
            case KeyCode.S:
                InputManager.s = false;
                InputManager.EmitPlayerDir();
                break;
            case KeyCode.D:
                InputManager.d = false;
                InputManager.EmitPlayerDir();
                break;

        }
    }

    static OnKeyPress(keyCode:number){

    }

}