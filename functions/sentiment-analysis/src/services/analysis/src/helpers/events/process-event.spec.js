const { processEvent } = require("./process-event.js");

describe( "Classify - (String)", () => {

    it("should be positive", async () => {
        let expectedEmotion = "positive";
        let textToBeClassified = "Well... actually I really like it";
        let classifiedScores = await processEvent({
            phrases: textToBeClassified
        });
        expect(classifiedScores.status).toBe("ok");
        expect(classifiedScores.data[0].classifiedAs.label).toBe(expectedEmotion);
    });

    it("should be positive", async () => {
        let expectedEmotion = "positive";
        let textToBeClassified = "It is ok, I like it.";
        let classifiedScores = await processEvent({
            phrases: textToBeClassified
        });
        expect(classifiedScores.status).toBe("ok");
        expect(classifiedScores.data[0].classifiedAs.label).toBe(expectedEmotion);
    });

    it("should be negative", async () => {
        let expectedEmotion = "negative";
        let textToBeClassified = "You do say bullshit!";
        let classifiedScores = await processEvent({
            phrases: textToBeClassified
        });
        expect(classifiedScores.status).toBe("ok");
        expect(classifiedScores.data[0].classifiedAs.label).toBe(expectedEmotion);
    });

    it("should be ERROR - ''", async () => {
        let textToBeClassified = "";
        let classifiedScores = await processEvent({
            phrases: textToBeClassified
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - '   '", async () => {
        let textToBeClassified = "   ";
        let classifiedScores = await processEvent({
            phrases: textToBeClassified
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - null", async () => {
        let textToBeClassified = null;
        let classifiedScores = await processEvent({
            phrases: textToBeClassified
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - undefined", async () => {
        let textToBeClassified = undefined;
        let classifiedScores = await processEvent({
            phrases: textToBeClassified
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - {}", async () => {
        let textToBeClassified = {};
        let classifiedScores = await processEvent({
            phrases: textToBeClassified
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - true", async () => {
        let textToBeClassified = true;
        let classifiedScores = await processEvent({
            phrases: textToBeClassified
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

});

describe( "Classify - (Array)", () => {

    it("should be ERROR - []", async () => {
        let classifiedScores = await processEvent({
            phrases: []
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - [{}]", async () => {
        let classifiedScores = await processEvent({
            phrases: [{}]
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - [Infinity]", async () => {
        let classifiedScores = await processEvent({
            phrases: [Infinity]
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - [-Infinity]", async () => {
        let classifiedScores = await processEvent({
            phrases: [-Infinity]
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - [null]", async () => {
        let classifiedScores = await processEvent({
            phrases: [null]
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("should be ERROR - [undefined]", async () => {
        let classifiedScores = await processEvent({
            phrases: [undefined]
        });
        expect(classifiedScores.status).toBe("error");
        expect(classifiedScores.data).toBe("No phrases were passed.");
    });

    it("validate multiple different options", async () => {
        let classifiedScores = await processEvent({
            phrases: [
                "Well... actually I really like it",
                undefined,
                "   It is ok, I like it.",
                {},
                "",
                "   ",
                null,
                true,
                " You do talk bullshit!   ",
                Infinity,
                -Infinity,
                false
            ]
        });

        expect(classifiedScores.status).toBe("ok");

        expect(classifiedScores.data.length).toBe(3);

        // Well... actually I really like it
        expect(classifiedScores.data[0].phrase).toBe("Well... actually I really like it");
        expect(classifiedScores.data[0].classifiedAs.label).toBe("positive");

        // It is ok, I like it.
        expect(classifiedScores.data[1].phrase).toBe("It is ok, I like it.");
        expect(classifiedScores.data[1].classifiedAs.label).toBe("positive");

        // You do talk bullshit!
        expect(classifiedScores.data[2].phrase).toBe("You do talk bullshit!");
        expect(classifiedScores.data[2].classifiedAs.label).toBe("negative");
    });

});