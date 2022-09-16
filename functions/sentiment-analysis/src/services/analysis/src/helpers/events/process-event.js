const Bayes = require("classificator");
const path = require("path");
const fs = require("fs");

/**
 * The `event` should include a `phrases` attribute that
 * can include a string or a number or an array that consists
 * of a combination of the aforementioned data types. 
 */
async function processEvent(event) {
    let phrases = event?.phrases;
    /**
     * Check if the passed `phrases` is an array with length > 0,
     * or a valid value based on the `validateValue` method.
     */
    if (phrases instanceof Array) {
        /**
         * Allow only strings and numbers that have been converted to strings.
         */
        for (let i = (phrases.length-1); i >= 0; i--) {
            let validatedValue = validateValue(phrases[i]);
            if (validatedValue == null) {
                phrases.splice(i, 1);
            } else {
                phrases[i] = validatedValue;
            }
        }
        if (phrases.length == 0) {
            return {
                status: "error",
                data: "No phrases were passed."
            };
        }
    } else {
        /**
         * Allow String or Number converted String. In any case, the output should be an array.
         */
        let validatedValue = validateValue(phrases);
        if (validatedValue != null) {
            phrases = [String(phrases)];
        } else {
            return {
                status: "error",
                data: "No phrases were passed."
            };
        }
    }

    let classificationResults = await new Promise((resolve) => {
        /**
         * The classifier has been trained based on the following dataset:
         * https://github.com/google-research/google-research/tree/master/goemotions
         */
         let classifierJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../classifiers/trained.full.min.json"), { encoding: "utf8" }));
         let BayesClassifier = Bayes.fromJson(classifierJSON);
         let classifiedPhrases = [];
         phrases.forEach((phrase) => {
            let phraseClassification = BayesClassifier.categorize(phrase);
            let formattedLikelihoods = {};
            // Format the output of the analysis
            phraseClassification.likelihoods.forEach((item) => {
                formattedLikelihoods[item["category"]] = {
                    label: String(item.category),
                    probability: String(item.proba),
                    logLikelihood: String(item.logLikelihood)
                };
            });
            classifiedPhrases.push({
                phrase: phrase,
                scores: formattedLikelihoods,
                classifiedAs: formattedLikelihoods[phraseClassification.predictedCategory]
            });
        });
         resolve(classifiedPhrases);
    });
    return {
        status: "ok",
        data: classificationResults
    };
}

function validateValue(value) {
    if (
        typeof value == "number"
        && value != Infinity 
        && value != -Infinity 
        && !isNaN(value)
    ) {
        return String(value);
    } else if (typeof value == "string" || value instanceof String) {
        value = value.trim();
        if (value.length > 0) {
            return value;
        }
    }
    return null;
}

module.exports = {
    processEvent
};