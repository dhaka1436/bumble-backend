const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");


const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
        Destination: {
            CcAddresses: [
            ],
            ToAddresses: [
                toAddress
            ],
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: "Hello We are Testing here in the text format email here ",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "We are Testing here",
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [

        ],
    });
};


const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
        "himanshudhaka987@gmail.com",
        "support@anshud.co.in",
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            /** @type { import('@aws-sdk/client-ses').MessageRejected} */
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};


module.exports = { run }