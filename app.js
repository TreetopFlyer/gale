
const {Div} = Gale({
    Title:{
        padding:"2rem",
        background: "blue",
        color:"white"
    }
})


function App()
{
    const count = van.state(1, "count");
    return Div.Title(
        {onclick(){count.val++}},
        "count:",
        ()=>count.val
    )
}

van.add(document.body, App);
