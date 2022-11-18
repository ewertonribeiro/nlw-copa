import { FormEvent, useState } from "react";
import Image from "next/image";

import { api } from "../lib/axios";

import logo from "../assets/logo.svg";
import appPreview from "../assets/app-nlw-copa-preview.png";
import avatarExample from "../assets/users-avatar-example.png";
import iconCheck from "../assets/icon-check.svg";

type HomeProps = {
  pollsCount: number;
  guessCount: number;
  userCount: number;
};

export default function HomePage(Props: HomeProps) {
  const [title, setTitle] = useState("");

  const createPoll = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { code },
      } = await api.post("/polls", {
        title,
      });

      await navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso, o código fiu copiado para a área de transferência!"
      );

      setTitle("");
    } catch (error) {
      console.log(error);
      alert("Não foi possível criar o bolão!");
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center px-4">
      <main>
        <Image src={logo} alt="Nwl Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={avatarExample} alt="Avatar" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{Props.userCount} </span>
            pessoa(s) já estão usando!
          </strong>
        </div>

        <form onSubmit={createPoll} className="mt-10 flex gap-2">
          <input
            type="text"
            required
            placeholder="Qual nome do seu Bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{Props.pollsCount} </span>
              <span>Bolões Criados!</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{Props.guessCount} </span>
              <span>Palpites Enviados!</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreview}
        alt="Preview Em Dispositivo Mobile"
        quality={100}
      />
    </div>
  );
}

export async function getStaticProps() {
  const [pollsCount, guessCount, userCount] = await Promise.all([
    api.get("polls/count"),
    api.get("guesses/count"),
    api.get("users/count"),
  ]);

  return {
    props: {
      pollsCount: pollsCount.data.count,
      guessCount: guessCount.data.count,
      userCount: userCount.data.count,
    },
    revalidate: 30,
  };
}
