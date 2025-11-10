import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { SignInFlow } from "../types";
import {useState} from "react";
import {TriangleAlert} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";


interface SignUpCardProps{
    setState:(state: SignInFlow)=>void;
}

export const SignUpCard=({setState}:SignUpCardProps)=>{

    const {signIn}=useAuthActions();
     
    const [name, setName] = useState("");
    const [email, setEmail] =useState("");
    const [password, setPassword] =useState("");
    const [confpassword, setconfPassword] =useState("");
    const [error,setError]=useState("");
    const [pending, setPending] = useState(false);

    const onPasswordSignUp=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if(password !== confpassword){
            setError("Password do not match");
            return;

        }
        setPending(true);
        signIn("password",{name, email, password, flow:"signUp"})
          .catch(()=>{
            setError("Something went wrong");
          })
          .finally(()=>{
            setPending(false);
          })
    };

    const onProviderSignUp = async (value: "github" | "google") => {
    try {
      setPending(true);
      await signIn(value); // Ensure this returns a Promise
    } finally {
      setPending(false);
    }
  };


    return(
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Sign Up to Continue
                </CardTitle>
                <CardDescription>
                Use your email or another service to continue
            </CardDescription>
            </CardHeader>
            {!!error &&(
                 <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4"/>
                    <p>{error}</p>

                    
                 </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={onPasswordSignUp} className="space-y-2.5">
                 <Input 
                 disabled={pending}
                 value={name}
                 onChange={(e)=>setName(e.target.value)}
                 placeholder="Full Name"
                 
                 required/>

               <Input 
                 disabled={pending}
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                 placeholder="Email"
                 type="email"
                 required/>

                 <Input 
                 disabled={pending}
                 value={password}
                 onChange={(e)=> setPassword(e.target.value)}
                 placeholder="Password"
                 type="password"
                 required/>

                 <Input 
                 disabled={pending}
                 value={confpassword}
                 onChange={(e)=> setconfPassword(e.target.value)}
                 placeholder="Confirm password"
                 type="password"
                 required/>

                 <Button type="submit" className="w-full" size="lg" disabled={pending}>
                    Continue
                 </Button>
                </form>
                <Separator/>
                <div className="flex flex-col gap-y-2.5">
                    <Button
                    disabled={pending}
                    onClick={()=> onProviderSignUp("google")}
                    variant="outline"
                    size="lg"
                    className="w-full relative">
                        
                        Continue with Google <FcGoogle className="size-5 absolute top-2.5 left-2.5"/>
                    </Button>
                    <Button
                    disabled={pending}
                    onClick={()=>onProviderSignUp("github")}
                    variant="outline"
                    size="lg"
                    className="w-full relative">
                        
                        Continue with Github <FaGithub className="size-5 absolute top-2.5 left-2.5"/>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                   Already have an account?<span onClick={()=> setState("signIn")} className="text-sky-700 hover:underline cursur-pointer">
                    Sign In
                   </span>
                </p>
            </CardContent>
        </Card>
            
    );
};