        const counterTag = document.getElementById("cotag")
        const saveTag = document.getElementById("save-tag")
        let count = 0

        function increment() {
            count ++
            counterTag.textContent = count
        }

        function save() {
            let entry = count + " - "
            saveTag.textContent += entry
            count = 0
            counterTag.textContent = count
        }