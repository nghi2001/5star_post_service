import bcrypt from 'bcrypt';
import { UserType } from '../models/UserModel';
import UserModel from '../models/UserModel';
import jwt, {Secret} from 'jsonwebtoken';
import RabbitService from './RabbitService';
import UserRepository from '../repository/UserRepository';
import { UserRepositoryInterface } from '../repository/interface/UserInterface';
class UserService {
    RabbitService
    UserRepository: UserRepositoryInterface

    constructor() {
        this.RabbitService = new RabbitService()
        this.UserRepository = new UserRepository()
    }
    hello() {
        return 'ajnvjlanvl';
    }

    async checkUserName(name:string):Promise<any> {
        let user = await this.UserRepository.findOne({username: name});
        return user
    }

    async activeUser(_id:string, code:string) {
        // let user = await this.UserRepository.UpdateOne({username:name}, {has_access : true})
        let user = await this.UserRepository.findOne({_id:_id});

        if(user) {
            if (user.code == code) {
                let user = await this.UserRepository.UpdateOne({_id:_id}, {has_access : true,code:''})
                return true
            } else {
                return 'InvalidCode'
            }
        } else {
            return 'NotFound'
        }
    }

    async registerAccount(user:UserType): Promise<UserType> {
        let salt = await bcrypt.genSalt();
        let hashpass = await bcrypt.hash(user.password, salt);
        user.password = hashpass;
        
        let newUser = await this.UserRepository.create(user)

        this.RabbitService.sendMessage(JSON.stringify({
            mail: newUser.email,
            content: `Đây là code để kích hoạt tài khoản của bạn: ${newUser.code}`
        }))
        
        let users = await this.checkUserName(newUser.username);
        
        setTimeout(async () => {
            console.log('check');
            
            let User = await this.checkUserName(newUser.username);
            if(User?.has_access == false) {
               this.UserRepository.DeleteOne({_id: newUser._id});
            } else {

            }
            
        },60000*2)
        return users          
    }

    async sigin(user:any) {
        let result = await this.UserRepository.findOne({username: user.username});
        if( result != null ){
            if(bcrypt.compareSync(user.password, result.password)) {
                return {status:true, data: result};
            }
        }
        return {status:false}        
    }


    async generateToken(user:any) {
        let {_id,username} = user
        //create Access Token
        const accessToken = jwt.sign({_id,username},process.env.ACCESS_TOKEN_SECRET as Secret,{
            expiresIn: '5m'
        })
        console.log(process.env.ACCESS_TOKEN_SECRET);
        console.log(1,accessToken);
        
        //create Refresh Token

        const refreshToken = jwt.sign({_id, username}, process.env.REFRESH_TOKEN_SECRET as Secret, {
            expiresIn : 60*60*24*30
        })

        return {
            accessToken,
            refreshToken
        }
    }

    async generateAccessToken(user:any) {
        let {_id,username} = user
        //create Access Token
        const accessToken = jwt.sign({_id,username},process.env.ACCESS_TOKEN_SECRET as Secret,{
            expiresIn: '5m'
        })
        console.log(process.env.ACCESS_TOKEN_SECRET);
        console.log(1,accessToken);

        return accessToken
    }

    async UpdateRefreshToken(id:string,name:string ,token:string) {
        
        let result = await this.UserRepository.addToken(id,name,token);

        return result
    }

    async changepass(username:string, newpass:string) {
        let salt = await bcrypt.genSalt();
        let hashpass = await bcrypt.hash(newpass, salt);
        let newuser = await this.UserRepository.UpdateOne({username: username}, {password: hashpass});
    }

    async getListToken (id: string) {
        let user: UserType = await this.UserRepository.findOne({_id: id});

        if(user && user.refreshToken) {
            return user.refreshToken
        } else {
            return []
        }
    }
    
    async checkExitsToken(id:string, token:string) {
        let user:UserType = await this.UserRepository.findOne({_id: id});
        if( user  && user.refreshToken) {
            
            for(let i = 0;i<user.refreshToken?.length;i++) {
                console.log(user.refreshToken[i],'nguyen duy', token);
                
                if( user.refreshToken[i].token == token) {
                    
                    return {data:user,status: true}
                }
            }

            return {status: 'Not Found'}
        } else {
            return {status: 'Not Found'}
        }
    }

    async revokeToken(idUser:string,idToken:string) {
        let result = await this.UserRepository.deleteToken(idUser, idToken)

        return result
    }
}

export default UserService