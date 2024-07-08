
module.exports = {
    name : "helper" , 

    actions : {
        getRandomNum() {
            return Math.random();
        }
    },

    events : {
        "helper.called"(payload) {
            this.logger.info("Helper service is called");
            this.logger.info(`Hello from ${payload}`);
            return "message from helper service"
        }
    } 
}