const Ajv = require("ajv");

const schema_processEvent = {
    "type": "object",
    "properties": {
        "Records": {
            "type": "array",
            "additionalItems": true,
            "items": [{
                "type": "object",
                "properties": {
                    "body": {
                        "type": "string",
                        "minLength": 1,
                        "errorMessage": "The body of the message is required." 
                    },
                    "messageAttributes": {
                        "type": "object",
                        "properties": {
                            "slackChannelId": {
                                "type": "object",
                                "properties": {
                                    "stringValue": {
                                        "type": "string",
                                        "minLength": 1,
                                        "errorMessage": "The slackChannelId is required." 
                                    }
                                },
                                "required": [
                                    "stringValue"
                                ]
                            },
                            "slackMessageEventTs": {
                                "type": "object",
                                "properties": {
                                    "stringValue": {
                                        "type": "string",
                                        "minLength": 1,
                                        "errorMessage": "The slackMessageEventTs is required." 
                                    }
                                },
                                "required": [
                                    "stringValue"
                                ]
                            },
                            "slackUserId": {
                                "type": "object",
                                "properties": {
                                    "stringValue": {
                                        "type": "string",
                                        "minLength": 1,
                                        "errorMessage": "The slackUserId is required." 
                                    }
                                },
                                "required": [
                                    "stringValue"
                                ]
                            },
                            "source": {
                                "type": "object",
                                "properties": {
                                    "stringValue": {
                                        "type": "string",
                                        "minLength": 1,
                                        "errorMessage": "The source is required." 
                                    }
                                },
                                "required": [
                                    "stringValue"
                                ]
                            },
                            "slackMessageTs": {
                                "type": "object",
                                "properties": {
                                    "stringValue": {
                                        "type": "string",
                                        "minLength": 1,
                                        "errorMessage": "The slackMessageTs is required." 
                                    }
                                },
                                "required": [
                                    "stringValue"
                                ]
                            }
                        },
                        "required": [
                            "slackChannelId",
                            "slackMessageEventTs",
                            "slackUserId",
                            "source",
                            "slackMessageTs"
                        ],
                    }
                },
                "required": [
                    "body"
                ],
            }]
        }
    },
    "required": [
        "Records"
    ]
};

function schema_processEvent_validate(data) {
    let ajvInstance = new Ajv({
        allErrors: true,
        strictTuples: false
    });
    require("ajv-errors")(ajvInstance);
    const validation = ajvInstance.validate(schema_processEvent, data);
    if (validation === true) {
        return {
            status: "ok",
            data: data
        };
    } else {
        return {
            status: "error",
            data: {
                vanillaErrorList: ajvInstance.errors,
                formattedErrorList: ajvInstance.errors?.map((item) => {
                    return item.message;
                })
            }
        };
    }
}

module.exports = {
    schema_processEvent_validate
};