document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");

    window.addCharacter = function (char) {
      emailInput.value += char;
    };

    window.deleteCharacter = function () {
      emailInput.value = emailInput.value.slice(0, -1);
    };

    window.saveEmail = function () {
      const email = emailInput.value.trim();
      if (!validateEmail(email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
      }

      const csvContent = `data:text/csv;charset=utf-8,Correo\n${email}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "emails.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Correo guardado correctamente.");
      emailInput.value = "";
      window.location.href = 'mural.html'; // Redirect to dialogos.html
    };

    function validateEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }
  });