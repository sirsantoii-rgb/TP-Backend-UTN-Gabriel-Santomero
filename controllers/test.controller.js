class TestController{
    get(request, response){
        response.send("test hecho bien")

    }
}

const testController = new TestController()
export default testController