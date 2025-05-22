        // Використовуємо адресу з нового поля address або з об'єкта structuredAddress
        address: typeof data.address === 'string'
          ? data.address
          : data.address instanceof Object && 'fullAddress' in data.address
            ? data.address.fullAddress
            : undefined,
        // Беремо перше значення з масиву джерел або undefined
        source: Array.isArray(data.source) && data.source.length > 0 
          ? data.source[0] as CreateClientRequest.source 
          : undefined,
        sourceDetails: data.sourceDetails || undefined
