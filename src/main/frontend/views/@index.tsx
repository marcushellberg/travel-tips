import {useState} from "react";
import Markdown from "react-markdown";
import {useForm} from "@vaadin/hilla-react-form";
import TripDetailsModel from "Frontend/generated/com/example/application/services/TravelTipService/TripDetailsModel";
import {Button, ComboBox, TextField} from "@vaadin/react-components";
import { TravelTipService } from "Frontend/generated/endpoints";

export default function TravelTipsView() {
  const [working, setWorking] = useState(false);
  const [markdown, setMarkdown] = useState("");

  const {field, model, submit} = useForm(TripDetailsModel, {
    onSubmit: async tripDetails => {
      setWorking(true)
      TravelTipService.getTravelTips(tripDetails)
        .onNext(token => setMarkdown(tip => tip + token))
        .onComplete(() => setWorking(false));
    }
  });

  return (
    <div className="p-m flex flex-col gap-m h-full">
      <h1>Travel tips!</h1>
      <div className="flex gap-s items-baseline">
        <TextField label="Destination" {...field(model.destination)} />
        <TextField label="Interests" className="flex-grow" {...field(model.interests)} />
        <ComboBox label="Mood" {...field(model.mood)} items={["Happy", "Sad", "Excited", "Tired"]} />
        <Button theme="primary" onClick={submit} disabled={working}>Get tips!</Button>
      </div>
      <Markdown className="flex-grow overflow-scroll">
        {markdown}
      </Markdown>
    </div>
  );
}
