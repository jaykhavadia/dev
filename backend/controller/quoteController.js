const Quote = require("../model/quoteModel");

module.exports.createOneQuote = async (req, res) => {
    try {
        const {name, email, mobile, serviceType, pincode, budget, message} = req.body;
        if(!name || !email || !mobile || !serviceType || !pincode){
            return res.status(400).json({message: "Required Payload not found"});
        }
        const quote = new Quote({name, email, mobile, serviceType, pincode, budget, message});
        console.log('quote: ', quote);
        await quote.save();
        return res.status(200).json(quote)
    } catch (error) {
        console.log("createOneQuote error", error);
        return res.status(500).json(error);
    }
}


module.exports.getAllQuote = async (req, res) => {
    try {
        const getQuote = await Quote.find();
        return res.status(200).json(getQuote);
    } catch (error) {
        console.log("getAllQuote error", error);
        return res.status(500).json(error);
    }
}