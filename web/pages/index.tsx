// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
type HomeProps = {
  count: number;
};
export default function Home(Props: HomeProps) {
  return <h1 className=" font-bold text-3xl underline">Home Page</h1>;
}

export const getServerSideProps = async () => {
  const { count } = (await (
    await fetch("http://localhost:5000/polls")
  ).json()) as { count: number };

  return {
    props: {
      count,
    },
  };
};
