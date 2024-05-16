package com.example.application.services;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import org.springframework.ai.chat.StreamingChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import reactor.core.publisher.Flux;

import java.util.Map;

@BrowserCallable
@AnonymousAllowed
public class TravelTipService {

    private final StreamingChatClient chatClient;

    private static final String TEMPLATE = """
            You are an expert traveler with near infinite knowledge of the world.
            You love to give travel tips to others, and you are always happy to help.

            I am traveling to {destination} and I am interested in {interests}.
            Currently, I am feeling {mood}.

            What tips do you have for me?
            """;

    public TravelTipService(StreamingChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public record TripDetails(
            String destination,
            String interests,
            String mood) {
    }


    public Flux<String> getTravelTips(TripDetails tripDetails) {
        var template = new PromptTemplate(TEMPLATE);

        var prompt = template.create(Map.of(
                "destination",tripDetails.destination(),
                "interests", tripDetails.interests(),
                "mood", tripDetails.mood()
        ));

        return chatClient.stream(prompt.toString());
    }
}
