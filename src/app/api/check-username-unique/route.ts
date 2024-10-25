import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  //optional
  //You are using and defined the process of only GET method in this regard
  //SO when ever someone does mistakenly used post ,etc give them the response

  //Now this code is not required in latest version of next JS so comment it

  // if(request.method!=='GET'){
  //     return Response.json({
  //         success:false,
  //         message:'Methods except GET is not allowed',
  //     },{status:405})
  // }

  await dbConnect();

  try {
    //get username=xyz from the url after the user enters the username
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          //if usernameErrors has error message length >0 print them with commas between eah error
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingverifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingverifiedUser) {
      return Response.json(
        {
          success: false,
          //if usernameErrors has error message length >0 print them with commas between eah error
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        //if usernameErrors has error message length >0 print them with commas between eah error
        message: "Username is unique",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error Checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
