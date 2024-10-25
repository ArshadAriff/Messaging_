import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,code}=await request.json()
        //When data is passed thr URL data is encoded like space="%20"etc. 
        //so to retrieve the original data we use this.
        const decodedUsername=decodeURIComponent(username)
        //fetching user from DB with username same as username got from request POST
        const user=await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User Not Found"
                },
                {status:500}
            )
        }

        const isCodeValid=user.verifyCode==code
        //check expiry date greater than today's date
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)> new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true
            await user.save()

            return Response.json(
                {
                    success:true,
                    message:"Account Verified Successfully"
                },
                {status:200}
            )
        }
        else if(!isCodeNotExpired){
            return Response.json(
                {
                    success:false,
                    message:"Verification Code Has Expired please sign up again to get new code"
                },
                {status:400}
            )
        }
        else{
            return Response.json(
                {
                    success:false,
                    message:"Incorrect verification Code"
                },
                {status:200}
            )
        }

    } catch (error) {
        console.error("Error verifying user",error)
        return Response.json(
            {
                success:false,
                message:"Error verifying user"
            },
            {status:500}
        )
    }
}