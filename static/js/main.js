document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const resultContainer = document.getElementById('result');
    const priceValue = document.getElementById('priceValue');
    const acceptBtn = document.getElementById('acceptBtn');
    const contactDetails = document.getElementById('contactDetails');
    const agentName = document.getElementById('agentName');
    const agentAgency = document.getElementById('agentAgency');
    const agentPhone = document.getElementById('agentPhone');
    const agentEmail = document.getElementById('agentEmail');
    const agentInitial = document.getElementById('agentInitial');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Prepare data from form
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Clear previous results
        resultContainer.style.display = 'none';
        contactDetails.style.display = 'none';

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                // Show prediction
                priceValue.innerText = `$${result.prediction.toLocaleString()}`;
                resultContainer.style.display = 'block';

                // Set agent info for later reveal
                agentName.innerText = result.agent.name;
                agentAgency.innerText = result.agent.agency;
                agentPhone.innerText = `📞 ${result.agent.phone}`;
                agentEmail.innerText = `✉️ ${result.agent.email}`;
                agentInitial.innerText = result.agent.name.charAt(0);
                
                // Smooth scroll to results
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Prediction failed: ' + result.error);
            }
        } catch (error) {
            console.error('Error fetching prediction:', error);
            alert('An error occurred during prediction.');
        }
    });

    acceptBtn.addEventListener('click', () => {
        contactDetails.style.display = 'block';
        acceptBtn.style.display = 'none';
        contactDetails.scrollIntoView({ behavior: 'smooth' });
    });
});
