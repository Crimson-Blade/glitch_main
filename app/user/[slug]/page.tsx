import UserProfile from "../../../components/UserProfile";
import { useRouter } from 'next/router'; // useRouter to get uuid

const UserPage = ({ params }: { params: { slug: string } }) => {
  // const router = useRouter();
  // const { uuid } = router.query; // Extract the UUID from the URL
  // if ( uuid) {
  //   return <div>Loading...</div>; // Show a loading message if the UUID is undefined
  // }

  return <UserProfile uuid={params.slug} />; // Pass uuid to the UserProfile component
};

export default UserPage;
