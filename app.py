import os

from backend import create_app

frontend_folder_path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), 'frontend')

app = create_app(static_folder=frontend_folder_path, static_url_path='')

if __name__ == '__main__':
    app.run(debug=True)
